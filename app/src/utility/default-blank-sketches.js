import snakeCase from 'lodash/snakeCase';


const yaml = () => `parameters:
sketch:
  - circle: [[0, 0], 10]
`;

const js = (name) => `function ${snakeCase(name)} (sketch) {
  return sketch.circle([0, 0], 10);
}
`;

const json = () => `{
  "filetype": "JSDraft",
  "version": "0.0.2",
}
`;

export { yaml, js, json };
