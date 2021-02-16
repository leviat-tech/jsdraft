module.exports = function* level(root) {
  const queue = []
  queue.push(root);
  while (queue.length > 0) {
    const sketch = queue.shift();
    yield sketch;
    for (const child of sketch.node.children) {
      queue.push(child);
    }
  }
}
