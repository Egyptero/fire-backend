const winston = require("winston");
const { Interaction } = require("../../../../models/interaction");
const logInteractionChange = require("../../../logger/logInteractionChange");
module.exports = async (node, interaction, workflow, requester) => {
  winston.info(`Execute condition node for interaction:${interaction._id}`);
  //We need to read the function of the condition
  winston.debug(
    "============================ Condition Function ========================================"
  );
  winston.debug(`The current func:${node.attrs.label.function}`);
  eval(node.attrs.label.function);
  try {
    const out = await func(interaction, async updateInteraction => {
      interaction = new Interaction(updateInteraction);
      interaction = await interaction.save();
      logInteractionChange(interaction, "Update", requester);
    });
    winston.info(`Out come of condition execution is:${out}`);

    if (out) return "Yes";
    else return "No";
  } catch (err) {
    return "Error";
  }
};
