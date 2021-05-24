const { base_entity_type } = require('../misc/entity-type.js');


function intersect_edge_2_edge(edge1, edge2) {
  const shape1 = edge1.shape;
  const shape2 = edge2.shape;

  return shape1.intersect(shape2);
}


function intersect_edge_2_polyface(edge, polyface) {
  const ip = [];

  if (polyface.isEmpty() || edge.shape.box.not_intersect(polyface.box)) {
    return ip;
  }

  const resp_edges = polyface.edges.search(edge.shape.box);

  for (const resp_edge of resp_edges) {
    for (const pt of intersect_edge_2_edge(edge, resp_edge)) {
      ip.push(pt);
    }
  }

  return ip;
}


function intersect_edge_2_polycurve(edge, polycurve) {
  const ip = [];

  if (polycurve.isEmpty() || edge.shape.box.not_intersect(polycurve.box)) {
    return ip;
  }

  for (const resp_edge of polycurve.edges) {
    for (const pt of intersect_edge_2_edge(edge, resp_edge)) {
      ip.push(pt);
    }
  }

  return ip;
}


module.exports = function intersect_polycurve(polycurve, shape) {
  const ip = [];

  for (const edge of polycurve.edges) {
    const type = base_entity_type(shape);

    if (type === 'polyface') {
      ip.push(...intersect_edge_2_polyface(edge, shape));
    } else if (type === 'polycurve') {
      ip.push(...intersect_edge_2_polycurve(edge, shape));
    } else if (['segment', 'arc'].includes(type)) {
      ip.push(...shape.intersect(edge.shape));
    }
  }

  return ip;
};
