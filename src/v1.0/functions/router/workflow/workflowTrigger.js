const winston = require("winston");
const { Interaction } = require("../../../models/interaction");
const executeWorkflowAfterNode = require("./executeWorkflowAfterNode");
const executeWorkflowNode = require("./executeWorkflowNode");
module.exports = async (requester) => {
  //  console.log(user);
  winston.info(
    `New routing request and user id:${JSON.stringify(requester._id)} `
  );
  let interactionInQueue = await Interaction.find({
    skillgroupId: { $in: requester.skillIds },
    $or: [{ stage: "Queue" }],
  })
    .sort({ priority: -1, lastModifiedDate: 1 })
    .limit(1);
  if (interactionInQueue && interactionInQueue.length > 0) {
    let interaction = interactionInQueue[0];
    if (interaction) await executeWorkflowNode(interaction, requester, "yes");
  }
};
