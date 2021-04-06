const { User } = require("../../../models/user");
const logUserChange = require("../../../functions/logger/logUserChange");
const getStateButtons = require("../messages/getStateButtons");

const {
  unRegisterUser,
  sendApplicationMessage,
  getEventManager,
} = require("../EventManager");
const notifyStatusToManagers = require("../messages/notifyStatusToManagers");

module.exports = async (socket, data, requester) => {
  //console.log(data);
  let logoutResult = {
    action: "Error",
    message: "",
    buttons: {},
    status: "Unknown",
    nextStatus: "Unknown",
  };

  let user = await User.findById(requester._id);
  if (!user) {
    logoutResult.message = "User not found";
    logoutResult.buttons = getStateButtons("Unknown");
    return sendApplicationMessage(
      "error",
      getEventManager(requester)[0],
      logoutResult
    );
  }
  if (
    user.status === "Not ready" ||
    user.status === "Error" ||
    user.status === "Logged In"
  ) {
    user.status = "Logged Out";
    user.nextStatus = "Unknown";
    user.inStateTime = Date.now();
  } else if (
    user.status !== "Handling" &&
    user.status !== "Ready" &&
    user.status !== "Wrap up"
  ) {
    user.nextStatus = "Logged Out";
    //user.inStateTime = Date.now(); status did not change , hence we should not set status
  } else {
    logoutResult.message = "User can not logout from this state:" + user.status;
    logoutResult.buttons = getStateButtons(user.status);
    return sendApplicationMessage(
      "error",
      getEventManager(requester)[0],
      logoutResult
    );
  }

  user.modifiedBy = requester._id;
  user.lastModifiedDate = Date.now();

  await user.save();

  logUserChange(user, "Update", requester._id);

  logoutResult.action = "logout";
  logoutResult.message = "Logged Out";
  logoutResult.buttons = getStateButtons(user.status);
  logoutResult.status = user.status;
  logoutResult.nextStatus = user.nextStatus;

  if (user.status === "Logged Out") {
    sendApplicationMessage("logout", getEventManager(user)[0], logoutResult);
    await unRegisterUser(user);
  } else 
    sendApplicationMessage("state", getEventManager(user)[0], logoutResult);

    //We need to notify manager hirarcy now
  notifyStatusToManagers(user);
  
};
