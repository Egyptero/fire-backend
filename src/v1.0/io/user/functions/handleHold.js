const { User } = require("../../../models/user");
const { Interaction } = require("../../../models/interaction");
const auth = require("../../auth/auth");
const sendMessage = require("../../system/systemMessages");
const { buttons } = require("../../common/userTools");
const getStateButtons = require("../messages/getStateButtons");
const sendAgentState = require("../messages/sendAgentState");
const logInteractionChange = require("../../../functions/logger/logInteractionChange");
const executeWorkflowAfterNode = require("../../../functions/router/workflow/executeWorkflowAfterNode");

const {
  changeUserState,
  sendApplicationMessage,
  getEventManager
} = require("../EventManager");

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
  interaction.stage = "Hold";
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
