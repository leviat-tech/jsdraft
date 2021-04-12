function pick(array, index) {
  if (index === undefined) index = 0;
  if (index === 'first') index = 0;
  if (index === 'last') index = array.length - 1;
  if (index < 0) index = array.length + index;
  return array[index];
}

module.exports = pick;
