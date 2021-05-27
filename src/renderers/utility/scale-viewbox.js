// Create an svg "viewbox" for a drawing that is plotted to scale.
function scale_viewbox(
  extents, aspect_ratio, center, size,
) {
  // Drawing extents are used to center drawing by default
  const xmin = extents.xmin;
  const xmax = extents.xmax;
  const ymin = extents.ymin;
  const ymax = extents.ymax;

  const width = xmax - xmin;
  const height = ymax - ymin;

  const midpoint = center
    ? { x: center[0], y: center[1] }
    : { x: xmin + width / 2, y: ymin + height / 2 };

  let vbwidth;
  let vbheight;

  if (aspect_ratio >= 1) {
    vbwidth = size;
    vbheight = size / aspect_ratio;
  } else {
    vbwidth = size * aspect_ratio;
    vbheight = size;
  }

  return `${midpoint.x - vbwidth / 2} ${-(midpoint.y + vbheight / 2)} ${vbwidth} ${vbheight}`;
}

module.exports = scale_viewbox;
