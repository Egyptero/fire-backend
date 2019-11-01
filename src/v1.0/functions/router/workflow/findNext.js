const findLinks = require("./findLinks");
const findPathLink = require("./findPathLink");
const findTarget = require("./findTarget");
module.exports = (workflow, currentNode, path) => {
  if (!currentNode) {
    // We should find the start node
    let resultNode = null;
    workflow.data.forEach(node => {
      switch (node.root.title) {
        case "Start":
          resultNode = node;
          break;
        default:
          break;
      }
    });
    return resultNode;
  } else {
    let links = findLinks(workflow, currentNode);
    // console.log("Links:" + JSON.stringify(links));
    if (!links) return;
    let link = findPathLink(links, path);
    // console.log("Link:" + JSON.stringify(link));
    if (!link) return;
    let resultNode = findTarget(workflow, link);
    return resultNode;
    //Now we need to find the target node.
  }
};
