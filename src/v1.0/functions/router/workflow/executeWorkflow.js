const winston = require("winston");
const findNext = require("./findNext");
const executeNode = require("./executeNode");
const { Interaction } = require("../../../models/interaction");
module.exports = async (interaction, workflow, requester) => {
  interaction.stage = "Routing";
  await interaction.save();

  winston.info(
    `Execute workflow:${workflow.name} and interaction id:${interaction._id}`
  );
  let node = findNext(workflow);
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
