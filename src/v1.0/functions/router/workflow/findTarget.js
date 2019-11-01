module.exports = (workflow, link) => {
  let resultNode = null;
  workflow.data.forEach(node => {
    if (node.id === link.target.id) resultNode = node;
  });
  return resultNode;
};
