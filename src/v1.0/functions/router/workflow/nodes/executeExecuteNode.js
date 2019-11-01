const winston = require("winston");
const { Interaction } = require("../../../../models/interaction");
const logInteractionChange = require("../../../logger/logInteractionChange");
module.exports = async (node, interaction, workflow, requester) => {
  winston.info(`Execute Execute node for interaction:${interaction._id}`);
  //We need to read the function of the condition
  winston.debug(
    "============================ Execute Function ========================================"
  );
  winston.debug(`The current func:${node.attrs.bodyText.function}`);
  eval(node.attrs.bodyText.function);
  try {
    await func(interaction, async updateInteraction => {
      interaction = new Interaction(updateInteraction);
      interaction = await interaction.save();
      logInteractionChange(interaction, "Update", requester);
    });
    winston.info(`Execute Node completed successfully`);
    return "Yes";
  } catch (err) {
    return "Error";
  }
};
