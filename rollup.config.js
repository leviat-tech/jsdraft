import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';


const output = (file, format) => ({
  input: 'src/index.js',
  output: {
    name: 'JSDraft',
    format,
    file,
  },
  plugins: [
    nodeResolve({ browser: true }),
    commonjs(),
  ],
});

export default [
  output('dist/jsdraft.js', 'umd'),
  output('dist/jsdraft.esm.js', 'esm'),
];
