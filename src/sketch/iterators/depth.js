module.exports = function* depth(root) {
  const queue = [root];

  while (queue.length > 0) {
    const sketch = queue.pop();
    yield sketch;

    const children = sketch.node.children.slice().reverse();

    for (const child of children) {
      queue.push(child);
    }
  }
};
