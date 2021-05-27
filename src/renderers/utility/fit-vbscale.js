function fit_vbscale(extents, padding, aspect_ratio) {
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

  return [-Infinity, Infinity].includes(vb) ? 1 : vb;
}

module.exports = fit_vbscale;
