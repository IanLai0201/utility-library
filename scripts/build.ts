import { execSync as exec } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import fs from 'fs-extra';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

function buildMetaFiles() {
  const pkg = fs.readJSONSync(path.join(rootDir, 'package.json'));

  const packageJson: Record<string, any> = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    keywords: pkg.keywords,
    author: pkg.author,
    license: pkg.license,
    type: 'module',
    main: './index.js',
    module: './index.mjs',
    types: './index.d.ts',
    exports: {
      '.': {
        types: './index.d.ts',
        require: './index.cjs',
        import: './index.mjs',
      },
    },
    peerDependencies: {
      'lodash-es': '^4.17.21',
    },
    publishConfig: {
      '@dev-toolkits:registry': 'https://gitlab.com/api/v4/projects/55027941/packages/npm/',
    },
  };

  // export all functions
  fs.readdirSync(distDir).forEach((file) => {
    if (fs.statSync(path.join(distDir, file)).isDirectory()) {
      packageJson['exports'][`./${file}`] = {
        types: `./${file}/index.d.ts`,
        require: `./${file}/index.cjs`,
        import: `./${file}/index.mjs`,
      };
    }
  });

  fs.writeJSONSync(path.join(distDir, 'package.json'), packageJson, { spaces: 2 });
  fs.copySync(path.join(rootDir, '.npmrc'), path.join(distDir, '.npmrc'));
  fs.copySync(path.join(rootDir, 'README.md'), path.join(distDir, 'README.md'));
  fs.copySync(path.join(rootDir, 'LICENSE'), path.join(distDir, 'LICENSE'));
}

function build() {
  console.log('Clean up');
  exec('rm -rf ./dist', { stdio: 'inherit' });

  console.log('Rollup');
  exec(`pnpm run build:rollup`, { stdio: 'inherit' });

  buildMetaFiles();
}

build();
