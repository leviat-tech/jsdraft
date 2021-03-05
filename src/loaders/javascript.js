// create a draft function from js definition and function name
function parse(input, identifier) {
  const func = new Function(input);

  const result = func();

  // TODO: test for the case of an object w/ parameter definitions, etc.
  const sketchfunc = result;
  sketchfunc.identifier = identifier;
  return sketchfunc;
}

function load(name, contents) {
  try {
    return parse(contents, name);
  } catch (e) {
    console.error(`Invalid js sketch: ${name} ${e}`);
  }
}

module.exports = { load };
