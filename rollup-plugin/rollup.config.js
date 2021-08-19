import JSDraftLoader from './plugin.js';


export default [
  {
    input: 'test/main.js',
    plugins: [JSDraftLoader()],
    output: {
      name: 'Test Import',
      format: 'esm',
      file: 'test-dist/test.esm',
    },
  },
  {
    input: 'plugin.js',
    output: {
      name: 'Plugin',
      file: 'dist/main.js',
      format: 'cjs',
    },
  },
];
