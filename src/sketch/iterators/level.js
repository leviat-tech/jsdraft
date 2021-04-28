module.exports = function* level(root, show = 'visible') {
  const queue = [];
  queue.push(root);
  while (queue.length > 0) {
    const sketch = queue.shift();

    if (sketch.node.hidden && show === 'visible') continue;
    if (!sketch.node.hidden && show === 'hidden') continue;

    yield sketch;
    for (const child of sketch.node.children) {
      queue.push(child);
    }
  }
};
