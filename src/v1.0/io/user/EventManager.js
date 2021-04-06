const winston = require("winston");
const _ = require("lodash");
const sendMessage = require("../system/systemMessages");
const sendAgentAddInteraction = require("./messages/sendAgentAddInteraction");
const sendAgentUpdateInteraction = require("./messages/sendAgentUpdateInteraction");
const sendAgentRemoveInteraction = require("./messages/sendAgentRemoveInteraction");
const sendAgentState = require("./messages/sendAgentState");
const offerTimer = require("../system/offerTimer");
let eventManagers = [];

const registerUser = async (socket, user) => {
  winston.info(`Register user request for ${user.firstname} ${user.lastname}`);
  let eventManager = { socket, user };
  if (getEventManager(user).length < 1) eventManagers.push(eventManager);
  else updateEventManager(eventManager);
};

const unRegisterUser = async (user) => {
  winston.info(
    `Unregister user request for ${user.firstname} ${user.lastname}`
  );
  eventManagers.map((eventManager, index) => {
    if (JSON.stringify(eventManager.user._id) === JSON.stringify(user._id)) {
      eventManagers.splice(index, 1);
    }
  });
};

const changeUserState = (user) => {
  winston.info(
    `Change user state request is received and user 
      ${user.firstname} ${user.lastname} and status ${user.status}`
  );
  let eventManagerList = getEventManager(user);
  if (eventManagerList.length > 0) {
    updateEventManager({
      socket: eventManagerList[0].socket,
      user: user,
    });
  }
};

const getEventManager = (user) => {
  let eventManagerList = [];
  eventManagers.map((eventManager) => {
    if (JSON.stringify(eventManager.user._id) === JSON.stringify(user._id))
      eventManagerList.push(eventManager);
  });
  return eventManagerList;
};

const getEventManagerBySocket = (socket) => {
  let eventManagerList = [];
  eventManagers.map((eventManager) => {
    if (JSON.stringify(eventManager.socket.id) === JSON.stringify(socket.id))
      eventManagerList.push(eventManager);
  });
  return eventManagerList;
};

const updateEventManager = (newEventManager) => {
  eventManagers.map((eventManager, index) => {
    if (
      JSON.stringify(eventManager.user._id) ===
      JSON.stringify(newEventManager.user._id)
    )
      eventManagers[index] = newEventManager;
  });
};

const findLAAEventManager = (targetSkillId) => {
  winston.info(`Received request for LAA and targetskill:${targetSkillId}`);
  let lAAEventManager = null;
  eventManagers.map((eventManager) => {
    //We should consider capacity rules here as per the skill groups configuration.
    //We should read the latest value from the database configuration.

    //First User has to be ready or according to capacity rule
    if (
      eventManager.user.status === "Ready" &&
      (eventManager.user.mode === "Push" || eventManager.user.mode === "Mix")
    ) {
      //Target skillid should be part of user Skills
      if (
        eventManager.user.skillIds.filter(
          (skillId) => JSON.stringify(skillId) === JSON.stringify(targetSkillId)
        ).length > 0
      ) {
        if (!lAAEventManager) lAAEventManager = eventManager;
        else {
          //let us compare last modified date and get the oldest one
          if (
            new Date(eventManager.user.inStateTime) <
            new Date(lAAEventManager.user.inStateTime)
          )
            lAAEventManager = eventManager;
        }
      }
    }
  });
  return lAAEventManager;
};
const sendApplicationMessage = async (type, eventManager, data, requester) => {
  winston.info(`Send user message ${data}`);
  console.log(data);
  if (!type) return;
  switch (type) {
    case "addinteraction":
      // The interaction in this stage is offer
      //First Reserve the agent
      changeUserState(
        await sendAgentState(eventManager, { status: "Reserved" }, requester)
      );
      //Send the interaction
      await sendAgentAddInteraction(type, eventManager, data);
      //Check offer timeout
      offerTimer(eventManager, data);
      break;
    case "removeinteraction": // Status should be managed at the action level
      await sendAgentRemoveInteraction(type, eventManager, data);
      break;
    case "updateinteraction":
      await sendAgentUpdateInteraction(type, eventManager, data);
      break;
    case "user":
      break;
    case "login":
      winston.info(
        `Send Login Message to 
          ${eventManager.user.firstname} 
          ${eventManager.user.lastname}`
      );
      return sendMessage(eventManager.socket, data, "Message");
    case "logout":
      winston.info(
        `Send Logout Message to 
          ${eventManager.user.firstname} 
          ${eventManager.user.lastname}`
      );
      return sendMessage(eventManager.socket, data, "Message");
    case "state":
      winston.info(
        `Send State Message to 
          ${eventManager.user.firstname} 
          ${eventManager.user.lastname}`
      );
      return sendMessage(eventManager.socket, data, "Message");
    case "notify":
      break;
    case "error":
      winston.info(
        `Send Error Message to 
          ${eventManager.user.firstname} 
          ${eventManager.user.lastname}`
      );
      return sendMessage(eventManager.socket, data, "Error");
    default:
      winston.error("Unknown message type should be sent to user");
      break;
  }
};

module.exports.registerUser = registerUser;
module.exports.unRegisterUser = unRegisterUser;
module.exports.changeUserState = changeUserState;
module.exports.findLAAEventManager = findLAAEventManager;
module.exports.getEventManager = getEventManager;
module.exports.getEventManagerBySocket = getEventManagerBySocket;
module.exports.sendApplicationMessage = sendApplicationMessage;
