const Point = require('./point.js');
const Line = require('./line.js');


class Rectangle {
   constructor(a, b) {
     if (arguments.length == 2) {
       this.a = a;
       this.b = b;
     } else {
       this.a = new Point(arguments[0], arguments[1]);
       this.b = new Point(arguments[2], arguments[3]);
     }
   }

   get top() {
     return new Line(this.a.x, this.b.y, this.b.x, this.b.y);
   }

   get bottom() {
     return new Line(this.a.x, this.a.y, this.b.x, this.a.y);
   }

   get left() {
     return new Line(this.a.x, this.a.y, this.a.x, this.b.y);
   }

   get right() {
     return new Line(this.b.x, this.a.y, this.b.x, this.b.y);
   }
}

module.exports = Rectangle;
