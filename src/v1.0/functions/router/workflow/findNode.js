module.exports = (workflow, nodeId) => {
  let outNode = null;
  workflow.data.forEach(node => {
    if (node.id === nodeId) outNode = node;
  });
  return outNode;
};
