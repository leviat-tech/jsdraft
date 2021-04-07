function traverse(queue, sketch) {
  queue.push(sketch);

  sketch.node.children.forEach((child) => {
    traverse(queue, child);
  });
}

module.exports = function* post(root) {
  const queue = [];
  traverse(queue, root);

  while (queue.length > 0) {
    const sketch = queue.pop();
    yield sketch;
  }
};
