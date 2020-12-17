const math = require('mathjs')
const Point = require('./point.js');


class Circle {
   constructor(center, radius) {
     this.center = center;
     if (typeof radius === 'number') {
       this.radius = radius;
     } else {
       this.radius = radius.sub(center).norm;
     }
   }

   point(t) {
     return new Point(
       this.center.x + math.cos(t) * this.radius,
       this.center.y + math.sin(t) * this.radius);
   }

   get top() {
     return this.point(0, 'deg');
   }

   get bottom() {
     return this.point(90, 'deg');
   }

   get left() {
     return this.point(180, 'deg');
   }

   get right() {
     return this.point(270, 'deg');
   }
}

module.exports = Circle;
