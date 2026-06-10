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
    else if (entry.name.endsWith('.component.ts')) files.push(full);
  }
  return files;
}

function extractBacktickBlock(content, fromIndex) {
  const open = content.indexOf('`', fromIndex);
  if (open === -1) return null;
  let i = open + 1;
  while (i < content.length) {
    if (content[i] === '\\') {
      i += 2;
      continue;
    }
    if (content[i] === '`') {
      return { value: content.slice(open + 1, i), start: open, end: i + 1 };
    }
    i++;
  }
  return null;
}

function findPropertyStart(content, propName) {
  const re = new RegExp(`\\b${propName}\\s*:`);
  const m = content.match(re);
  return m ? m.index : -1;
}

function removeTrailingComma(content, index) {
  let i = index;
  while (i < content.length && /\s/.test(content[i])) i++;
  if (content[i] === ',') i++;
  while (i < content.length && /\s/.test(content[i])) i++;
  return i;
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, '.component.ts');

  if (content.includes('templateUrl')) {
    return { filePath, status: 'skipped', reason: 'already external' };
  }

  const templateProp = findPropertyStart(content, 'template');
  if (templateProp === -1) {
    return { filePath, status: 'skipped', reason: 'no inline template' };
  }

  const backtickStart = content.indexOf('`', templateProp);
  const templateBlock = extractBacktickBlock(content, backtickStart);
  if (!templateBlock) {
    return { filePath, status: 'error', reason: 'failed to parse template' };
  }

  const htmlPath = path.join(dir, `${base}.component.html`);
  fs.writeFileSync(
    htmlPath,
    templateBlock.value.replace(/^\n/, '').replace(/\s+$/, '') + '\n'
  );

  let styleBlock = null;
  const stylesProp = findPropertyStart(content, 'styles');
  if (stylesProp !== -1) {
    const styleBacktick = content.indexOf('`', stylesProp);
    styleBlock = extractBacktickBlock(content, styleBacktick);
    if (styleBlock) {
      const scssPath = path.join(dir, `${base}.component.scss`);
      fs.writeFileSync(
        scssPath,
        styleBlock.value.replace(/^\n/, '').replace(/\s+$/, '') + '\n'
      );
    }
  }

  let updated = content;

  // Remove styles block first (comes after template usually)
  if (styleBlock) {
    const stylesEnd = removeTrailingComma(updated, styleBlock.end);
    const stylesSliceStart = stylesProp;
    let bracketStart = updated.lastIndexOf('[', stylesProp);
    const propLineStart = updated.lastIndexOf('\n', stylesProp) + 1;
    const sliceStart = updated.slice(propLineStart, stylesProp).includes('[')
      ? propLineStart
      : bracketStart !== -1 && bracketStart > stylesProp - 20
        ? updated.lastIndexOf('\n', bracketStart) + 1
        : stylesProp;
    updated = updated.slice(0, sliceStart) + updated.slice(stylesEnd);
  }

  // Remove template block
  const templateEnd = removeTrailingComma(updated, templateBlock.end);
  const templateLineStart = updated.lastIndexOf('\n', templateProp) + 1;
  updated =
    updated.slice(0, templateLineStart) + updated.slice(templateEnd);

  const replacement = styleBlock
    ? `templateUrl: './${base}.component.html',\n  styleUrls: ['./${base}.component.scss'],\n  `
    : `templateUrl: './${base}.component.html',\n  `;

  updated = updated.replace(/@Component\(\{\s*/, `@Component({\n  ${replacement}`);
  updated = updated.replace(/\n\],\n\}\)/g, '\n})');

  fs.writeFileSync(filePath, updated);
  return { filePath, status: 'ok' };
}

const results = findComponentFiles(srcDir).map(processFile);
console.log(
  JSON.stringify(
    {
      ok: results.filter((r) => r.status === 'ok').length,
      skipped: results.filter((r) => r.status === 'skipped').length,
      errors: results.filter((r) => r.status === 'error').length,
      details: results,
    },
    null,
    2
  )
);
