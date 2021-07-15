// Iterate the tree, yielding all visible nodes, but not the children of hidden nodes.
module.exports = function* hidden(root) {
  const queue = [root];

  while (queue.length > 0) {
    const sketch = queue.pop();

    yield sketch;
    if (!sketch.node.hidden) {
      const children = sketch.node.children.slice().reverse();

      for (const child of children) {
        queue.push(child);
      }
    }
  }
};
