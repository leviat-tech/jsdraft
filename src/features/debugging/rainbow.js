module.exports = function rainbow(sketch) {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple'];
  const exploded = sketch.new;

  // draw all polyfaces
  sketch.polyfaces.forEach((face, i) => {
    const color = colors[i % colors.length];
    exploded.add(exploded.create({ entity: face }).stroke('none').fill(color, 0.25));
  });

  // draw all edges
  sketch.edges.forEach((edge, i) => {
    const color = colors[i % colors.length];
    exploded.add(exploded.create({ entity: edge }).stroke(color));
  });

  // draw all vertices
  sketch.vertices.forEach((vertex, i) => {
    const color = colors[i % colors.length];
    exploded.add(exploded.create({ entity: vertex }).stroke(color));
  });

  return exploded;
};
