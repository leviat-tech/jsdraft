import commonjs from '@rollup/plugin-commonjs';


const config = {
  input: 'src/main.js',
  output: {
    file: 'dist/draft.js',
    format: 'umd',
    name: 'Draft',
  },
  plugins: [commonjs()],
};

export default config;