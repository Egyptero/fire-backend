const winston = require("winston");
const { Interaction } = require("../../models/interaction");
const { Tenant } = require("../../models/tenant");
const handleReject = require("../user/functions/handleReject");

module.exports = async (eventManager, interaction) => {
  if (!interaction || !eventManager) return;
  //Now let us find the tenant
  let offerTimeout = 0;
  let tenant = await Tenant.findById(interaction.tenantId);

  if (!tenant) return;
  let user = eventManager.user;
  if (!user) return;
  //In case user override the tenant configuration , then read wrapup timeout from this
  if (user.overrideUserConf) offerTimeout = user.offerTimeout;
  else offerTimeout = tenant.offerTimeout;
  if (offerTimeout > 0) {
    winston.info(
      "Interaction will be removed after:",
      JSON.stringify(offerTimeout),
      " seconds"
    );
    setTimeout(checkAcceptance, offerTimeout * 1000, [
      eventManager,
      interaction,
    ]);
  }
};

const checkAcceptance = async (params) => {
  let eventManager = params[0];
  let interaction = params[1];

  if (!interaction || !eventManager) return;
  interaction = await Interaction.findById(interaction._id);
  // console.log("At check acceptance");
  // console.log(eventManager);
  //Interaction stage is offering
  if (interaction.stage === "Offer") {
    handleReject(
      eventManager.socket,
      { interactionId: interaction._id },
      eventManager.user
    );
  }
};
