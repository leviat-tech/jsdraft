module.exports = function* depth(root, show = 'visible') {
  const queue = [root];

  while (queue.length > 0) {
    const sketch = queue.pop();

    if (sketch.node.hidden && show === 'visible') continue;
    if (!sketch.node.hidden && show === 'hidden') continue;

    yield sketch;

    const children = sketch.node.children.slice().reverse();

    for (const child of children) {
      queue.push(child);
    }
  }
};
