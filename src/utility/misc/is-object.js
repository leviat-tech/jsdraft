// Is an object and not an array
function is_object(value) {
  return value && !Array.isArray(value) && typeof value === 'object';
}

module.exports = is_object;
