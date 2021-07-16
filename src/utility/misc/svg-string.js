function svg_string({ tag, attributes = {}, contents, nodes }) {
  const attrs = Object.entries(attributes)
    .map(([attr, value]) => `${attr}="${value}"`).join(' ');
  if (contents) {
    return `<${tag} ${attrs} >${contents}</${tag}>`;
  }

  if (nodes) {
    const s = nodes.map((o) => svg_string(o)).join('');
    return `<${tag} ${attrs} >${s}</${tag}>`;
  }

  return `<${tag} ${attrs} />`;
}

module.exports = svg_string;
