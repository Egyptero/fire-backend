const winston = require("winston");
const findNext = require("./findNext");
const findNode = require("./findNode");
const executeNode = require("./executeNode");
const { Workflow } = require("../../../models/workflow");
const { Interaction } = require("../../../models/interaction");
const logInteractionChange = require("../../logger/logInteractionChange");
module.exports = async (interaction, requester) => {
  let workflow = await Workflow.findById(interaction.workflowId);
  if (!workflow) {
    interaction.stage = "Error";
    await interaction.save();
    logInteractionChange(interaction, "Update", requester);
    winston.info(
      `Can not Continue workflow and interaction id:${
        interaction._id
      } and nodeId:${interaction.nodeId}, workflow deleted`
    );
    return;
  }
  interaction.stage = "Routing";
  await interaction.save();
  logInteractionChange(interaction, "Update", requester);
  
  winston.info(
    `Continue workflow:${workflow.name} and interaction id:${
      interaction._id
    } and nodeId:${interaction.nodeId}`
  );
  let node = findNode(workflow, interaction.nodeId);
  while (node) {
    let resultPath = await executeNode(node, interaction, workflow, requester);
    interaction = await Interaction.findById(interaction._id);
    if (resultPath === "Hold") {
      winston.info(
        `Workflow:${workflow.name} will be on hold on interaction:${
          interaction._id
        } as the interaction will enter queue or handling`
      );

      node = null;
    } else {
      if (node.root.title !== "Stop") {
        node = findNext(workflow, node, resultPath);
      } else {
        winston.info(
          `Workflow:${
            workflow.name
          } has completed successfully on interaction:${interaction._id}`
        );
        node = null;
      }
    }
  }
};
