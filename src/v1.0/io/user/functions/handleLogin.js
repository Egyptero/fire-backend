const { User } = require("../../../models/user");
const { Interaction } = require("../../../models/interaction");
const sendMessage = require("../../system/systemMessages");
const { buttons } = require("../../common/userTools");
const sendAgentState = require("../messages/sendAgentState");
const logUserChange = require("../../../functions/logger/logUserChange");
const getStateButtons = require("../messages/getStateButtons");
const {
  changeUserState,
  registerUser,
  sendApplicationMessage,
  getEventManager
} = require("../EventManager");
module.exports = async (socket, data, requester) => {
  console.log(data);
  let loginResult = {
    action: "Error",
    message: "",
    buttons: { ...buttons },
    status: "Unknown",
    nextStatus: "Unknown"
  };

  let user = await User.findById(requester._id);
  if (!user) {
    loginResult.message = "User not found";
    loginResult.buttons = getStateButtons("Unknown");
    return sendMessage(socket, loginResult, "Error");
  }
  if (
    !user.status ||
    user.status === "Unknown" ||
    user.status === "Logged Out" ||
    user.status === "Error" ||
    user.status === "Reserved" ||
    user.status === "Handling"
  ) {
    user.status = "Logged In";
    user.nextStatus = "Logged In";
  } else user.nextStatus = user.status;

  user.modifiedBy = requester._id;
  user.lastModifiedDate = Date.now();
  user.interactionIds = [];
  await user.save();
  logUserChange(user, "Update", requester._id);

  loginResult.action = "login";
  loginResult.message = "Logged In";
  loginResult.buttons = getStateButtons(user.status);
  loginResult.status = user.status;
  loginResult.nextStatus = user.nextStatus;

  await registerUser(socket, user);
  sendApplicationMessage("login", getEventManager(user)[0], loginResult);
  //We need to load the current agent interactions and send it to them
  console.log("Log current user interactions");
  console.log(user.interactionIds);
  let interactions = await Interaction.find({
    agentId: user._id,
    $or: [{ stage: "Offer" }, { stage: "Handle" }, { stage: "Hold" }]
  });
  interactions.forEach(async (interaction, index) => {
    switch (interaction.stage) {
      case "Offer":
        sendApplicationMessage(
          "addinteraction",
          getEventManager(user)[0],
          interaction,
          user
        );
        break;
      case "Handle":
        user = await sendAgentState(
          getEventManager(user)[0],
          { status: "Handling" },
          user
        );
        changeUserState(user);
        sendApplicationMessage(
          "updateinteraction",
          getEventManager(user)[0],
          interaction,
          requester
        );
        break;
      case "Hold":
        user = await sendAgentState(
          getEventManager(user)[0],
          { status: "Handling" },
          user
        );
        changeUserState(user);
        sendApplicationMessage(
          "updateinteraction",
          getEventManager(user)[0],
          interaction,
          requester
        );
        break;
      default:
        break;
    }
  });
};
