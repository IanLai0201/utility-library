import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const input = 'src/index.ts';
const external = ['lodash-es'];

export default [
  {
    input,
    plugins: [esbuild()],
    output: [
      {
        file: `dist/index.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `dist/index.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
    external,
  },
  {
    input,
    plugins: [dts()],
    output: {
      file: `dist/index.d.ts`,
      format: 'es',
    },
    external,
  },
];
