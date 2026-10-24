import { copyFile, mkdir, rm } from 'node:fs/promises';
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
