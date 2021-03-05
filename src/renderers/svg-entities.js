const DEFAULT_STROKE = 'rgba(0,0,0,1)';
const DEFAULT_FILL = 'rgba(255,255,255,1)';


function recurse(list, sketch, style) {
  // set style
  const s = { ...sketch.node.style, ...style };

  // add entities to list
  for (const entity of sketch.node.entities) {
    list.push(entity.svg({
      stroke: s.stroke?.color || DEFAULT_STROKE,
      strokeWidth: s.stroke?.width || 0,
      fill: s.fill || DEFAULT_FILL,
    }));
  }

  // draw children
  for (const child of sketch.node.children) {
    recurse(list, child, s);
  }
}

module.exports = function render(sketch) {
  const entity_list = [];
  recurse(entity_list, sketch);
  return entity_list;
};
