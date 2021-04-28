function* all(root, show) {
  const queue = [root];

  while (queue.length > 0) {
    const sketch = queue.pop();

    if (sketch.node.hidden && show === 'visible') continue;

    yield sketch;
    const children = sketch.node.children.slice().reverse();

    for (const child of children) {
      queue.push(child);
    }
  }
}

function* hidden(root) {
  const queue = [{ sketch: root, showoverride: false }];

  while (queue.length > 0) {
    let { sketch, showoverride } = queue.pop();

    if (sketch.node.hidden) showoverride = true;

    if (showoverride) yield sketch;

    const children = sketch.node.children.slice().reverse();

    for (const child of children) {
      queue.push({ sketch: child, showoverride });
    }
  }
}

module.exports = function depth(root, show = 'visible') {
  if (show === 'hidden') return hidden(root);
  return all(root, show);
};
