import JSDraftPlugin from './dist/main.js';


const config = {
  plugins: [{ ...JSDraftPlugin(), enforce: 'pre' }],
};

export default config;
