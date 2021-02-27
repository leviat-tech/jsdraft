import snakeCase from 'lodash/snakeCase';


const yaml = () => `parameters:
sketch:
`;

const js = (name) => `return function ${snakeCase(name)} (sketch, ...args) {
  return sketch;
}
`;

export { yaml, js };
