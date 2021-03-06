import snakeCase from 'lodash/snakeCase';


const yaml = () => `parameters:
sketch:
`;

const js = (name) => `function ${snakeCase(name)} (sketch) {
  return sketch;
}
`;

export { yaml, js };
