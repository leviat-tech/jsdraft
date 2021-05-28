const flatten = require('@flatten-js/core');


// Monkey patch flatten.Point to add type property
Object.defineProperty(flatten.Point.prototype, 'type', {
  get() { return 'point'; },
});

class Point extends flatten.Point {
}


module.exports = Point;
