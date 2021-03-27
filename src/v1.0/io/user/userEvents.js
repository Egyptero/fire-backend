const { validateInput } = require("../validation/messageValidation");
const sendMessage = require("../system/systemMessages");
const { buttons } = require("../common/userTools");
const handleLogin = require("./functions/handleLogin");
const handleLogout = require("./functions/handleLogout");
const handleAlive = require("./functions/handleAlive");
const handleChangeState = require("./functions/handleChangeState");
const handleDisconnect = require("./functions/handleDisconnect");
const handleAccept = require("./functions/handleAccept");
const handleReject = require("./functions/handleReject");
const handleClose = require("./functions/handleClose");
const handleHold = require("./functions/handleHold");
const handleResume = require("./functions/handleResume");
const handleTerminate = require("./functions/handleTerminate");
const handleTransfer = require("./functions/handleTransfer");
const handleConference = require("./functions/handleConference");

const auth = require("../auth/auth");
const {
  changeUserState: updateUserState,
  registerUser,
  unRegisterUser,
  getEventManagerBySocket,
} = require("./EventManager");
/*
 * Event Manager is the carrier of the current event manager of the agent
 * Event Manager is loacted in arrage for all logged in Agent where each agent will have his own event manager
 * FIRE Backend will update agent events from the Event Manager
 *
 */

module.exports.onConnection = (socket) => {
  let connectionResult = {
    action: "Aknowledge",
    message: "Connected",
    buttons: { ...buttons },
    status: "Unknown",
    nextStatus: "Unknown",
    inStateTime: Date.now(),
  };

  connectionResult.buttons.login = true;
  sendMessage(socket, connectionResult, "Connected");
  //TODO We need to respond here
  socket.on("message", async (data) => {
    await onUserMessage(socket, data);
  });

  //TODO We need to remove the user from the event manager
  socket.on("disconnect", async () => {
    console.log(
      "Client disconnected , we should remove it from the live array"
    );
    let eventManagerList = getEventManagerBySocket(socket);
    if (eventManagerList && eventManagerList.length > 0) {
      let user = eventManagerList[0].user;
      //console.log(user);
      if (
        user.status === "Ready" ||
        user.status === "Not ready" ||
        user.status === "Wrap up" ||
        user.status === "Logged In" ||
        user.status === "Unknown"
      ) {
        user.status = "Logged Out";
        user.inStateTime = Date.now();
        await user.save();
      } else if (user.status === "Handling" || user.status === "Reserved") {
        user.status = "Error";
        user.inStateTime = Date.now();
        await user.save();
      }

      unRegisterUser(user);
    }
  });
};

const onUserMessage = async (socket, data) => {
  console.log("New user message", data);
  const { error } = validateInput(data);
  //console.log("New user message , validation", error);
  if (error) {
    let errorResult = {
      action: "Error",
      message: error.details[0].message,
      buttons: { ...buttons },
      status: "Unknown",
      nextStatus: "Unknown",
      inStateTime: Date.now(),
    };
    return sendMessage(socket, errorResult, "Error");
  }

  let loginResult = {
    action: "Error",
    message: "",
    buttons: { ...buttons },
    status: "Unknown",
    nextStatus: "Unknown",
    inStateTime: Date.now(),
  };

  const authResult = auth(data);
  if (!authResult) {
    loginResult.message = "Internal Server Error";
    loginResult.buttons.login = true;
    return sendMessage(socket, loginResult, "Error");
  }
  if (authResult.error) {
    loginResult.message = authResult.message;
    loginResult.buttons.login = true;
    return sendMessage(socket, loginResult, "Error");
  }

  if (data.action === "login")
    await handleLogin(socket, data, authResult.decoded);
  if (data.action === "logout")
    await handleLogout(socket, data, authResult.decoded);
  if (data.action === "accept") handleAccept(socket, data, authResult.decoded);
  if (data.action === "reject") handleReject(socket, data, authResult.decoded);
  if (data.action === "close") handleClose(socket, data, authResult.decoded);
  if (data.action === "conference")
    handleConference(socket, data, authResult.decoded);
  if (data.action === "hold") handleHold(socket, data, authResult.decoded);
  if (data.action === "resume") handleResume(socket, data, authResult.decoded);
  if (data.action === "terminate")
    handleTerminate(socket, data, authResult.decoded);
  if (data.action === "transfer")
    handleTransfer(socket, data, authResult.decoded);
  if (data.action === "state")
    await handleChangeState(socket, data, authResult.decoded);
  if (data.action === "alive") handleAlive(socket, data);
  if (data.action === "disconnect") handleDisconnect(socket, data);
};

module.exports.onUserMessage = onUserMessage;
