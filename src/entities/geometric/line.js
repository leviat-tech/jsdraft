const math = require('mathjs')
const Point = require('./point.js');


class Line {
   constructor(a, b) {
     if (arguments.length == 2) {
       this.a = a;
       this.b = b;
     } else {
       this.a = new Point(arguments[0], arguments[1]);
       this.b = new Point(arguments[2], arguments[3]);
     }
   }

   get midpoint() {
     return new Point((this.a.x + this.b.x) / 2.0, (this.a.y + this.b.y) / 2.0);
   }

   get length() {
     return math.sqrt(math.pow(this.b.x - this.a.x, 2) + math.pow(this.b.y - this.a.y, 2));
   }
}

module.exports = Line;
