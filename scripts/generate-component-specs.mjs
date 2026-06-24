#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src');

function findComponentFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findComponentFiles(full, files);
    else if (entry.name.endsWith('.component.ts') && !entry.name.endsWith('.spec.ts'))
      files.push(full);
  }
  return files;
}

function getClassName(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const m = content.match(/export class (\w+)/);
  return m ? m[1] : null;
}

function getSelector(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const m = content.match(/selector:\s*['"]([^'"]+)['"]/);
  return m ? m[1] : null;
}

function needsRouter(content) {
  return /RouterModule|RouterOutlet|routerLink|Router\b/.test(content);
}

function needsHttp(content) {
  return /HttpClient/.test(content);
}

function generateSpec(componentPath, className, selector) {
  const content = fs.readFileSync(componentPath, 'utf8');
  const relImport = './' + path.basename(componentPath).replace('.ts', '');
  const providers = [];
  const imports = [`import { ${className} } from '${relImport}';`];

  if (needsRouter(content)) {
    imports.push(`import { provideRouter } from '@angular/router';`);
    providers.push('provideRouter([])');
  }
  if (needsHttp(content)) {
    imports.push(`import { provideHttpClient } from '@angular/common/http';`);
    providers.push('provideHttpClient()');
  }

  const providersBlock =
    providers.length > 0
      ? `\n      providers: [${providers.join(', ')}],`
      : '';

  return `${imports.join('\n')}
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('${className}', () => {
  let component: ${className};
  let fixture: ComponentFixture<${className}>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${className}],${providersBlock}
    }).compileComponents();

    fixture = TestBed.createComponent(${className});
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve ter o seletor correto', () => {
    expect(selector).toBe('${selector}');
  });
});
`;
}

const created = [];
const skipped = [];

for (const filePath of findComponentFiles(srcDir)) {
  const specPath = filePath.replace('.component.ts', '.component.spec.ts');
  if (fs.existsSync(specPath)) {
    skipped.push(specPath);
    continue;
  }
  const className = getClassName(filePath);
  const selector = getSelector(filePath);
  if (!className || !selector) continue;
  fs.writeFileSync(specPath, generateSpec(filePath, className, selector));
  created.push(specPath);
}

console.log(`Created ${created.length}, skipped ${skipped.length}`);
