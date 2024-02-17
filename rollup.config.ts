import fs from 'node:fs';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

function getFiles(path: string) {
  const functionNames: string[] = [];

  fs.readdirSync(path).forEach((file) => {
    functionNames.push(`${file}`);
  });

  return functionNames;
}

const configs: RollupOptions[] = [];

getFiles('src').forEach((fn) => {
  const fnName = fn === 'index.ts' ? `index.ts` : `${fn}/index.ts`;
  const input = `src/${fnName}`;

  configs.push({
    input,
    plugins: [resolve(), commonjs(), esbuild()],
    output: [
      {
        file: `dist/${fnName.replace('.ts', '.js')}`,
        format: 'cjs',
      },
      {
        file: `dist/${fnName.replace('.ts', '.mjs')}`,
        format: 'esm',
      },
    ],
    external: ['lodash-es'],
  });

  // dts
  configs.push({
    input,
    plugins: [dts()],
    output: [
      {
        file: `dist/${fnName.replace('.ts', '.d.ts')}`,
        format: 'esm',
      },
    ],
    external: [],
  });
});

export default configs;
