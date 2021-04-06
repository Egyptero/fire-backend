const { User } = require("../../../models/user");
const { Interaction } = require("../../../models/interaction");
const auth = require("../../auth/auth");
const sendMessage = require("../../system/systemMessages");
const { buttons } = require("../../common/userTools");
const getStateButtons = require("../messages/getStateButtons");
const sendAgentState = require("../messages/sendAgentState");
const executeWorkflowNode = require("../../../functions/router/workflow/executeWorkflowNode");
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
    nextStatus: "Unknown"
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
  let eventManager = require("../EventManager").getEventManager(requester)[0];
  if (!eventManager) {
    require("../EventManager").changeUserState(
      await sendAgentState(
        getEventManager(requester)[0],
        { status: "Logged Out" },
        requester
      )
    );
    return;
  }
  require("../EventManager").changeUserState(
    await sendAgentState(eventManager, { status: "Not ready" }, requester)
  );
  await require("../EventManager").sendApplicationMessage(
    "removeinteraction",
    eventManager,
    interaction,
    requester
  );
  executeWorkflowNode(interaction, requester);
};
