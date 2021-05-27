// Create an svg "viewbox" for fitting a drawing to an viewport.
function fit_viewbox(
  extents, padding, aspect_ratio,
) {
  // Padding is assumed to be in model units
  const xmin = extents.xmin - padding.left;
  const xmax = extents.xmax + padding.right;
  const ymin = extents.ymin - padding.bottom;
  const ymax = extents.ymax + padding.top;

  const width = xmax - xmin;
  const height = ymax - ymin;

  const content_aspect_ratio = width / height;

  const midpoint = { x: xmin + width / 2, y: ymin + height / 2 };

  let vbwidth;
  let vbheight;

  if (content_aspect_ratio > aspect_ratio) {
    vbwidth = width;
    vbheight = width / aspect_ratio;
  } else {
    vbwidth = height * aspect_ratio;
    vbheight = height;
  }

  return `${midpoint.x - vbwidth / 2} ${-(midpoint.y + vbheight / 2)} ${vbwidth} ${vbheight}`;
}

module.exports = fit_viewbox;
