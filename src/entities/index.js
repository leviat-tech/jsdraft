const Arc = require('./geometric/arc.js');
const Circle = require('./geometric/circle.js');
const Point = require('./geometric/point.js');
const Polycurve = require('./geometric/polycurve.js');
const Polyface = require('./geometric/polyface.js');
const Rectangle = require('./geometric/rectangle.js');
const Segment = require('./geometric/segment.js');


function factory(Class) {
  return function build(...args) {
    return new Class(...args);
  };
}

module.exports = {
  Arc,
  Circle,
  Point,
  Polycurve,
  Polyface,
  Rectangle,
  Segment,
  arc: factory(Arc),
  circle: factory(Circle),
  point: factory(Point),
  polycurve: factory(Polycurve),
  polyface: factory(Polyface),
  rectangle: factory(Rectangle),
  segment: factory(Segment),
};
