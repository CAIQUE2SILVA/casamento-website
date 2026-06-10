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

function extractProp(content, name) {
  const re = new RegExp(`${name}\\s*:\\s*([\\s\\S]*?)(?=,\\s*\\n\\s*(?:selector|standalone|imports|templateUrl|styleUrls|providers)\\s*:|\\n\\})`);
  // Simpler: line-based extraction
  const lines = content.split('\n');
  const start = lines.findIndex((l) => new RegExp(`^\\s*${name}\\s*:`).test(l));
  if (start === -1) return null;
  let depth = 0;
  let buf = [];
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    buf.push(line);
    for (const ch of line) {
      if (ch === '[' || ch === '{') depth++;
      if (ch === ']' || ch === '}') depth--;
    }
    if (i > start && depth <= 0 && line.trim().endsWith(',')) break;
    if (i > start && depth <= 0 && !line.includes('[') && !line.includes('{')) break;
  }
  return buf.join('\n').replace(/,\s*$/, '');
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const decoratorMatch = content.match(/@Component\(\{([\s\S]*?)\}\)/);
  if (!decoratorMatch) return;

  const block = decoratorMatch[1];
  const props = ['selector', 'standalone', 'imports', 'providers', 'templateUrl', 'styleUrls'];
  const extracted = {};
  for (const prop of props) {
    const re = new RegExp(`(${prop}\\s*:[\\s\\S]*?)(?=,\\n\\s*(?:selector|standalone|imports|providers|templateUrl|styleUrls)\\s*:|\\n\\s*\\})`);
    const m = block.match(new RegExp(`${prop}\\s*:\\s*([^\\n]+|\\[[\\s\\S]*?\\])`));
    if (prop === 'imports' || prop === 'providers') {
      const idx = block.indexOf(`${prop}:`);
      if (idx === -1) continue;
      let depth = 0;
      let started = false;
      let end = idx;
      for (let i = idx; i < block.length; i++) {
        const ch = block[i];
        if (ch === '[') { depth++; started = true; }
        if (ch === ']') depth--;
        if (started && depth === 0) { end = i + 1; break; }
      }
      extracted[prop] = block.slice(idx, end).trim().replace(/,\s*$/, '');
    } else {
      const line = block.match(new RegExp(`${prop}\\s*:\\s*[^,\\n]+`));
      if (line) extracted[prop] = line[0].trim();
    }
  }

  const ordered = [];
  for (const prop of props) {
    if (extracted[prop]) ordered.push('  ' + extracted[prop] + ',');
  }
  if (ordered.length === 0) return;

  const newDecorator = `@Component({\n${ordered.join('\n')}\n})`;
  const updated = content.replace(/@Component\(\{[\s\S]*?\}\)/, newDecorator);
  fs.writeFileSync(filePath, updated);
}

for (const f of findComponentFiles(srcDir)) processFile(f);
console.log('Normalized decorators');
