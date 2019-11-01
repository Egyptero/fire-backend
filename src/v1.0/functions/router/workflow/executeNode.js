const executeQueueToSkillNode = require("./nodes/executeQueueToSkillNode");
const executeSendToBotNode = require("./nodes/executeSendToBotNode");
const executeSendToIvrNode = require("./nodes/executeSendToIvrNode");
const executeSendToRoutingNode = require("./nodes/executeSendToRoutingNode");
const executeExecuteNode = require("./nodes/executeExecuteNode");
const executeConditionNode = require("./nodes/executeConditionNode");
const executeStartNode = require("./nodes/executeStartNode");
const executeStopNode = require("./nodes/executeStopNode");
const { startNodeLog, stopNodeLog } = require("../../logger/logNode");

module.exports = async (node, interaction, workflow, requester) => {
  let resultPath = "Yes";
  let nodeId = await startNodeLog({
    nodeName: node.root.title,
    workflowName: workflow.name,
    nodeId: node.id,
    workflowId: workflow._id.toHexString(),
    interactionId: interaction._id.toHexString(),
    dateIn: Date.now(),
    state: "In"
  });
  switch (node.root.title) {
    case "Queue":
      resultPath = await executeQueueToSkillNode(
        node,
        interaction,
        workflow,
        requester
      );
      break;
    case "Bot":
      resultPath = executeSendToBotNode(node, interaction, workflow, requester);
      break;
    case "Ivr":
      resultPath = executeSendToIvrNode(node, interaction, workflow, requester);
      break;
    case "Routing":
      resultPath = executeSendToRoutingNode(
        node,
        interaction,
        workflow,
        requester
      );
      break;
    case "Execute":
      resultPath = await executeExecuteNode(
        node,
        interaction,
        workflow,
        requester
      );
      break;
    case "Condition":
      resultPath = await executeConditionNode(
        node,
        interaction,
        workflow,
        requester
      );
      break;
    case "Start":
      resultPath = await executeStartNode(
        node,
        interaction,
        workflow,
        requester
      );
      break;
    case "Stop":
      resultPath = await executeStopNode(
        node,
        interaction,
        workflow,
        requester
      );
      break;
    default:
      break;
  }

  if (resultPath !== "Hold")
    await stopNodeLog(nodeId, {
      nodeName: node.root.title,
      workflowName: workflow.name,
      nodeId: node.id,
      dateOut: Date.now(),
      state: resultPath
    });
  return resultPath;
};
