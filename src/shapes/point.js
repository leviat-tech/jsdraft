const math = require('mathjs')


class Point {
   constructor(x, y) {
     this.x = x;
     this.y = y;
   }

   add(a) {
     return new Point(this.x + a.x, this.y + a.y);
   }

   sub(a) {
     return new Point(this.x - a.x, this.y - a.y);
   }

   get norm() {
     return math.norm([this.x, this.y]);
   }
}

module.exports = Point;
