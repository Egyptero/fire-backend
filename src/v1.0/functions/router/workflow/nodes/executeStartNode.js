const winston = require("winston");
const logInteractionChange = require("../../../logger/logInteractionChange");
module.exports = async (node, interaction, workflow, requester) => {
  winston.info(`Execute start node for interaction:${interaction._id}`);
  interaction.stage = "Routing";
  await interaction.save();
  console.log("We should log update regarding interaction routing");
  logInteractionChange(interaction, "Update", requester);
  return "Yes";
};
