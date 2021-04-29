function calculate_viewbox(
  extents, fit, padding, aspect_ratio, scale, center, size,
) {
  const xmin = extents.xmin - padding.left;
  const xmax = extents.xmax + padding.right;
  const ymin = extents.ymin - padding.bottom;
  const ymax = extents.ymax + padding.top;

  const width = xmax - xmin;
  const height = ymax - ymin;

  const content_aspect_ratio = width / height;
  let vb;
  if (content_aspect_ratio > aspect_ratio) { // width is limiting
    vb = width / 1000;
  } else { // height is limiting
    vb = (height / 1000) * aspect_ratio;
  }

  const viewboxscale = [-Infinity, Infinity].includes(vb) ? 1 : vb;

  const scalefactor = fit ? viewboxscale : (size / 1000);

  const midpoint = {
    x: center.x !== undefined ? center.x : xmin + width / 2,
    y: center.y !== undefined ? center.y : ymin + height / 2,
  };

  let vbwidth;
  let vbheight;

  if (fit) {
    if (content_aspect_ratio > aspect_ratio) {
      vbwidth = width;
      vbheight = width / aspect_ratio;
    } else {
      vbwidth = height * aspect_ratio;
      vbheight = height;
    }
  } else if (aspect_ratio >= 1) {
    vbwidth = size;
    vbheight = size / aspect_ratio;
  } else {
    vbwidth = size * aspect_ratio;
    vbheight = size;
  }

  const viewbox = `${midpoint.x - vbwidth / 2} ${-(midpoint.y + vbheight / 2)} ${vbwidth} ${vbheight}`;

  return { viewbox, scalefactor };
}

module.exports = calculate_viewbox;
