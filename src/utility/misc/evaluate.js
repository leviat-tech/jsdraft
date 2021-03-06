const notevil = require('notevil');


/*
WARNING: THIS IS INSECURE: USE SECURE PARSING AND EVALUATION TO PREVENT POISONED DRAFT FILES
============================================================================================
Curretly "notevil" isn't used because it doesn't have perfect parity with JS.  For example:
return sketch.draw(
  sketch.point([0, 0]),
  sketch.point([25, 25]), // <<<<<<
)
Breaks because of the trailing comma on the last argument. At least lets create a test case
that breaks or warns until secure evaluation is completed.
*/
function evaluate(expression, context) {
  return notevil(expression, context);
}

module.exports = evaluate;
