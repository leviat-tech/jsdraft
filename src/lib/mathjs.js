import { create, all } from 'mathjs';


function maxArgumentCount(fn) {
  return Object.keys(fn.signatures || {})
    .reduce((args, signature) => {
      const count = (signature.match(/,/g) || []).length + 1;
      return Math.max(args, count);
    }, -1);
}

const config = {
  predictable: true,
  matrix: 'Array',
};
const math = create(all, config);

// Custom expression functions
function amap(arr, f) {
  const args = maxArgumentCount(f);
  return arr.map((item, index, a) => {
    if (args === 1) return f(item);
    if (args === 2) return f(item, index + 1);
    return f(item, index + 1, a);
  });
}

function contains(collection, val) {
  return collection.includes(val);
}

function reverse(arr) {
  return [...arr].reverse();
}

function padInt(int, len) {
  const str = String(int);
  return '0'.repeat(len - str.length) + str;
}

math.import({ amap, contains, reverse, padInt });

export default math;
