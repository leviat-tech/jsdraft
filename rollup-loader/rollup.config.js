import JSDraftLoader from './loader.js';


export default ({
  input: 'test/main.js',
  plugins: [JSDraftLoader()],
  output: {
    name: 'Test Import',
    format: 'esm',
    file: 'dist/test.esm',
  },
});
