const winston = require("winston");
const logInteractionChange = require("../../../logger/logInteractionChange");
const {
  findLAAEventManager,
  sendApplicationMessage
} = require("../../../../io/user/EventManager");
module.exports = async (node, interaction, workflow, requester) => {
  winston.info(`Execute queue node for interaction:${interaction._id}`);

  //Check skillId from node , and in case no skill Id , then raise an error.
  if (!node.attrs.bodyText.skillId) {
    winston.info(
      "Skill ID must be defined in the workflow. Please review your workflow"
    );
    interaction.stage = "Error";
    await interaction.save();
    logInteractionChange(interaction, "Update", requester);
    return "Error";
  }
  interaction.skillgroupId = node.attrs.bodyText.skillId;
  //Now let us check online and ready agents for routing an interaction.
  const eventManager = findLAAEventManager(interaction.skillgroupId);
  //Agent is avaliable , we need to route the interaction to him
  interaction.nodeId = node.id;
  interaction.workflowId = workflow._id;
  if (eventManager) {
    console.log("We have Ready Agent with id:" + eventManager.user._id);
    interaction.stage = "Offer";
    interaction.agentId = eventManager.user._id;
    await interaction.save();
    await sendApplicationMessage(
      "addinteraction",
      eventManager,
      interaction,
      requester
    );
    logInteractionChange(interaction, "Update", requester);
    //We should add timeout factor , so after some time according to node configuration , we should redirect the interaction to someone else
  } else {
    interaction.stage = "Queue";
    await interaction.save();
    logInteractionChange(interaction, "Update", requester);
    // We need to update interaction with skillId
    // We may need to assign free Agent , or park the call in queue.
  }
  return "Hold"; // We may return Yes , No , Error or Hold
};
