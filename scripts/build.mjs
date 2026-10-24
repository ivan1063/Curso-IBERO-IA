import { extractKnowledge } from './knowledge.mjs';
import { copyFile, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// Publish only explicit public assets, never agent instructions or repository files.
for (const name of ['index.html', 'app.js', 'styles.css', '404.html', '_headers']) {
  await copyFile(resolve(root, 'Antigravity', name), resolve(output, name));
}
console.log('Static site ready in dist/');

const knowledge = extractKnowledge(await readFile(resolve(root, 'Antigravity/index.html'), 'utf8'));
await mkdir(resolve(root, 'netlify/lib'), { recursive: true });
await writeFile(resolve(root, 'netlify/lib/site-knowledge.mjs'), 'export default ' + JSON.stringify(knowledge, null, 2) + ';\n');
console.log('Site knowledge refreshed from HTML (' + knowledge.sections.length + ' sections)');
