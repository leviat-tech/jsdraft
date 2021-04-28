function traverse(queue, sketch, show) {
  if (sketch.node.hidden && show === 'visible') return;
  if (!sketch.node.hidden && show === 'hidden') return;

  queue.push(sketch);

  sketch.node.children.forEach((child) => {
    traverse(queue, child);
  });
}

module.exports = function* post(root, show = 'visible') {
  const queue = [];
  traverse(queue, root, show);

  while (queue.length > 0) {
    const sketch = queue.pop();
    yield sketch;
  }
};
