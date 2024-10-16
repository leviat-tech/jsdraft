module.exports = function arrow(sketch, params) {
  // start points = start points, x, y
  // end points = end points, x, y
  // width = width or thickness of neck of arrow, required parameter
  // arrowHeadLength = Arrow Head Length, required parameter
  // arrowHeadWidth = Arrow Head Width, required parameter

  const { startPoint, endPoint, neckWidth, arrowHeadLength, arrowHeadWidth } = params;
  const radsToDegrees = (rads) => (rads / Math.PI) * 180.0;
  const relativeX = endPoint[0] - startPoint[0];
  const relativeY = endPoint[1] - startPoint[1];
  const arrowLength = Math.sqrt(relativeX ** 2 + relativeY ** 2);
  const rotationRads = Math.atan2(relativeY, relativeX);
  const rotationDegrees = radsToDegrees(rotationRads) - 90;
  const neckWidthHalf = neckWidth / 2;
  const arrowHeadWidthHalf = arrowHeadWidth / 2;
  const neckLength = arrowLength - arrowHeadLength;

  const pointsHead = [
    [-arrowHeadWidthHalf, neckLength],
    [0, arrowLength],
    [arrowHeadWidthHalf, neckLength],
    [0, neckLength],
  ];
  const pointsNeck = [
    [-neckWidthHalf, neckLength],
    [neckWidthHalf, neckLength],
    [neckWidthHalf, 0],
    [-neckWidthHalf, 0],
    [-neckWidthHalf, neckLength],
  ];

  const arrowHead = sketch.polyface(...pointsHead);
  const arrowNeck = sketch.polyface(...pointsNeck);
  const arrowSketch = arrowNeck.union(arrowHead);

  return sketch.new.add(arrowSketch.rotate(rotationDegrees).translate(startPoint[0], startPoint[1]));
};
