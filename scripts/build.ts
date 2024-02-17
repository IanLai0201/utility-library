import { execSync as exec } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

const FILES_COPY_ROOT = ['LICENSE', 'README.md', 'package.json'];

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

async function buildMetaFiles() {
  for (const file of FILES_COPY_ROOT) {
    await fs.copyFile(path.join(rootDir, file), path.join(distDir, file));
  }
}

async function build() {
  console.log('Clean up');
  exec('pnpm run clean', { stdio: 'inherit' });

  console.log('Rollup');
  exec(`pnpm run build:rollup`, { stdio: 'inherit' });

  await buildMetaFiles();
}

build();
