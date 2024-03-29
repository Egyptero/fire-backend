const sendMessage = require("../../system/systemMessages");
const { User } = require("../../../models/user");
const { buttons } = require("../../common/userTools");
const logUserChange = require("../../../functions/logger/logUserChange");
const getStateButtons = require("./getStateButtons");
const workflowTrigger = require("../../../functions/router/workflow/workflowTrigger");
const winston = require("winston");
const notifyMessage = require("../../system/notifyMessage");
const notifyStatusToManagers = require("./notifyStatusToManagers");
module.exports = async (eventManager, data, requester) => {
  console.log(
    `Agent ${eventManager.user.firstname} ${eventManager.user.lastname} state will be changed to:${data.status}`
  );

  //Rules of changing state.
  // When Agent Click on any state , system should be able to change to the desired status
  let stateResult = {
    action: "Error",
    message: "",
    buttons: { ...buttons },
    status: "Unknown",
    nextStatus: "Unknown",
    inStateTime: Date.now(),
  };
  let user = await User.findById(eventManager.user._id);
  //In case we do not have requester , then we should consider same user as requester
  if (!requester) requester = user;
  user.status = data.status;
  if (data.nextStatus) user.nextStatus = data.nextStatus; // Read next status if it exist
  else user.nextStatus = data.status;

  user.modifiedBy = requester._id;
  user.lastModifiedDate = Date.now();
  user.inStateTime = Date.now();

  await user.save();
  logUserChange(user, "Update", requester._id);

  stateResult.action = "state";
  stateResult.message = "Change State";
  stateResult.buttons = getStateButtons(user.status);
  stateResult.status = user.status;
  stateResult.nextStatus = user.nextStatus;
  stateResult.inStateTime = user.inStateTime;

  sendMessage(eventManager.socket, stateResult, "Message");

  //We need to notify manager hirarcy now
  notifyStatusToManagers(user);
  //We should trigger work flow here about ready user , in future we should consider capacity routing here
  if (user.status === "Ready") {
    winston.info(`Agent is ready and we should pickup task from Queue`);
    workflowTrigger(requester);
  }

  return user;
};
