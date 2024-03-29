const { User } = require("../../../models/user");
const logUserChange = require("../../../functions/logger/logUserChange");
const getStateButtons = require("../messages/getStateButtons");

const {
  changeUserState,
  sendApplicationMessage,
  getEventManager,
} = require("../EventManager");
const workflowTrigger = require("../../../functions/router/workflow/workflowTrigger");
const winston = require("winston");
const notifyStatusToManagers = require("../messages/notifyStatusToManagers");

module.exports = async (socket, data, requester) => {
  let stateResult = {
    action: "Error",
    message: "",
    buttons: {},
    status: "Unknown",
    nextStatus: "Unknown",
    inStateTime: Date.now(),
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
    user.inStateTime = Date.now();
  } else user.nextStatus = data.status;

  user.modifiedBy = requester._id;
  //user.lastModifiedDate = Date.now();

  await user.save();
  logUserChange(user, "Update", requester._id);
  stateResult.action = "state";
  stateResult.message = "Change State";
  stateResult.buttons = getStateButtons(user.status);
  stateResult.status = user.status;
  stateResult.nextStatus = user.nextStatus;
  stateResult.inStateTime = user.inStateTime;

  changeUserState(user);
  let outcome = await sendApplicationMessage(
    "state",
    getEventManager(user)[0],
    stateResult
  );
  //We need to notify manager hirarcy now
  notifyStatusToManagers(user);
  if (user.status === "Ready") {
    winston.info(`Agent is ready and we should pickup task from Queue`);
    workflowTrigger(requester);
  }
  return outcome;
};
