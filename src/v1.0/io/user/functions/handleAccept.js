const { User } = require("../../../models/user");
const { Interaction } = require("../../../models/interaction");
const auth = require("../../auth/auth");
const sendMessage = require("../../system/systemMessages");
const { buttons } = require("../../common/userTools");
const getStateButtons = require("../messages/getStateButtons");
const sendAgentState = require("../messages/sendAgentState");
const logInteractionChange = require("../../../functions/logger/logInteractionChange");
const {
  changeUserState,
  sendApplicationMessage,
  getEventManager,
} = require("../EventManager");
const { Tenant } = require("../../../models/tenant");

module.exports = async (socket, data, requester) => {
  let stateResult = {
    action: "Error",
    message: "",
    buttons: {},
    status: "Unknown",
    nextStatus: "Unknown",
  };
  let interaction = await Interaction.findById(data.interactionId);
  let user = await User.findById(requester._id);
  if (!user) {
    stateResult.message = "User not found";
    stateResult.buttons = getStateButtons("Unknown");
    return sendApplicationMessage(
      "error",
      getEventManager(requester)[0],
      stateResult
    );
  }
  if (!interaction) {
    changeUserState(
      await sendAgentState(
        getEventManager(requester)[0],
        { status: "Not ready" },
        requester
      )
    );
    return;
  }
  let eventManager = getEventManager(requester)[0];
  if (!eventManager) {
    changeUserState(
      await sendAgentState(
        getEventManager(requester)[0],
        { status: "Logged Out" },
        requester
      )
    );
    return;
  }
  //We need to ensure wrap up option here in order to set next status
  let tenant = await Tenant.findById(interaction.tenantId);
  let nextStatus = "";
  if (tenant) {
    if (user.overrideUserConf) {
      if (user.wrapup) nextStatus = "Wrap up";
    } else {
      if (tenant.wrapup) nextStatus = "Wrap up";
    }
  }

  changeUserState(
    await sendAgentState(eventManager, { status: "Handling",nextStatus }, requester)
  );
  interaction.stage = "Handle";
  interaction.agentId = eventManager.user._id;
  await interaction.save();
  await sendApplicationMessage(
    "updateinteraction",
    eventManager,
    interaction,
    requester
  );
  logInteractionChange(interaction, "Update", requester);
};
