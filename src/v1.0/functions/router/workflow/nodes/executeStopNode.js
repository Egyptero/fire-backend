const winston = require("winston");
const logInteractionChange = require("../../../logger/logInteractionChange");
module.exports = async (node, interaction, workflow, requester) => {
  winston.info(`Execute stop node for interaction:${interaction._id}`);
  interaction.stage = "Close";
  await interaction.save();
  logInteractionChange(interaction, "Update", requester);
  return "Yes";
};
