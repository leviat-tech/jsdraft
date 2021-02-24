import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';


const config = {
  input: 'src/main.js',
  output: {
    file: 'dist/draft.js',
    format: 'umd',
    name: 'Draft',
  },
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
  ],
};

export default config;
