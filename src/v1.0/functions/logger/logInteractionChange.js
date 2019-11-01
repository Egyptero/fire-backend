const winston = require("winston");
const {
  Interactionlog,
  validate
} = require("../../models/logs/interactionlog");
module.exports = async (interaction, action, by) => {
  let data = {
    interactionId: interaction._id.toHexString(),
    action: action,
    details: {
      by: by,
      data: interaction
    }
  };
  if (interaction.skillgroupId)
    data.skillgroupId = interaction.skillgroupId.toHexString();
  if (interaction.customerId)
    data.customerId = interaction.customerId.toHexString();
  if (interaction.tenantId) data.tenantId = interaction.tenantId.toHexString();

  const { error } = validate(data);
  if (error)
    return winston.error(
      `Error adding interaction log ${error.details[0].message}`
    );
  const interactionlog = new Interactionlog(data);
  await interactionlog.save();
};
