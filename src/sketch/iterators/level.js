function* all(root, show) {
  const queue = [];
  queue.push(root);
  while (queue.length > 0) {
    const sketch = queue.shift();

    if (sketch.node.hidden && show === 'visible') continue;

    yield sketch;
    for (const child of sketch.node.children) {
      queue.push(child);
    }
  }
}

function* hidden(root) {
  const queue = [];
  queue.push({ sketch: root, showoverride: false });

  while (queue.length > 0) {
    let { sketch, showoverride } = queue.shift();

    if (sketch.node.hidden) showoverride = true;

    if (showoverride) yield sketch;

    for (const child of sketch.node.children) {
      queue.push({ sketch: child, showoverride });
    }
  }
}


module.exports = function level(root, show = 'visible') {
  if (show === 'hidden') return hidden(root);
  return all(root, show);
};
