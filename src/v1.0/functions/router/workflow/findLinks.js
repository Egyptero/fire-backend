module.exports = (workflow, srcNode) => {
  let links = [];
  workflow.data.forEach(node => {
    switch (node.root.title) {
      case "Link":
        if (node.source.id === srcNode.id) links.push(node);
        break;
      default:
        break;
    }
  });
  return links;
};
