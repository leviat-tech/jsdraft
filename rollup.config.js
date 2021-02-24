import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';


const config = {
  input: 'src/main.js',
  output: {
    file: 'dist/draft.js',
    format: 'esm',
    name: 'Draft',
  },
  plugins: [
    commonjs(),
    resolve(),
  ],
};

export default config;
