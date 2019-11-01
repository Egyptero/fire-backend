const { User } = require("../../../models/user");
const logUserChange = require("../../../functions/logger/logUserChange");
const getStateButtons = require("../messages/getStateButtons");

const {
  changeUserState,
  sendApplicationMessage,
  getEventManager
} = require("../EventManager");

module.exports = async (socket, data, requester) => {
  console.log(data);
  let stateResult = {
    action: "Error",
    message: "",
    buttons: {},
    status: "Unknown",
    nextStatus: "Unknown"
  };
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
  if (user.status !== "Handling" && user.status !== "Reserved") {
    user.status = data.status;
    user.nextStatus = user.status;
  } else user.nextStatus = data.status;

  user.modifiedBy = requester._id;
  user.lastModifiedDate = Date.now();

  await user.save();
  logUserChange(user, "Update", requester._id);

  stateResult.action = "state";
  stateResult.message = "Change State";
  stateResult.buttons = getStateButtons(user.status);
  stateResult.status = user.status;
  stateResult.nextStatus = user.nextStatus;

  changeUserState(user);
  return await sendApplicationMessage(
    "state",
    getEventManager(user)[0],
    stateResult
  );
};
