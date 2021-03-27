const winston = require("winston");
const logInteractionChange = require("../../../logger/logInteractionChange");
const { Interaction } = require("../../../../models/interaction");
const {
  findLAAEventManager,
  sendApplicationMessage,
} = require("../../../../io/user/EventManager");
module.exports = async (node, interaction, workflow, requester,agentReady) => {
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
  interaction.skillgroupId = node.attrs.bodyText.skillId; //

  // We need to check Queue here first to ensure queue size. If there is queue , then add interaction to queue and start
  //Get queue on the same skill ID
  let interactionsInQueue = await Interaction.find({
    stage: "Queue",
    skillgroupId: interaction.skillgroupId,
  });
  interaction.nodeId = node.id;
  interaction.workflowId = workflow._id;

  if (interactionsInQueue.length > 0 && !agentReady) { // temp stop
    winston.info(`Queue found for skill Id ${interaction.skillgroupId} and 
    current queue size is : ${interactionsInQueue.length}`);
    interaction.stage = "Queue";
    interaction.lastModifiedDate = Date.now();
    //We should add instate here to track interaction stage time
    await interaction.save();
    logInteractionChange(interaction, "Update", requester);
  } else {
    // Then try to find LAA , if not , do nothing.
    //Now let us check online and ready agents for routing an interaction.
    const eventManager = findLAAEventManager(interaction.skillgroupId);
    //Agent is avaliable , we need to route the interaction to him
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
  }
  return "Hold"; // We may return Yes , No , Error or Hold
};
