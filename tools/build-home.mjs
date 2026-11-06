// Fills the data-driven parts of index.html (services, clients, cities, form options,
// structured data) from the data files. Runs before tools/build-es.mjs.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fill } from './home-blocks.mjs';

const file = join(dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
writeFileSync(file, fill(readFileSync(file, 'utf8'), 'en', ''));
console.log('index.html blocks updated');
