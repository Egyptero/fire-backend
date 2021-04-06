const winston = require("winston");
const { Tenant } = require("../../models/tenant");
const { getEventManager, changeUserState } = require("../user/EventManager");
const sendAgentState = require("../user/messages/sendAgentState");
module.exports = async (user, interaction) => {
  if (!user) return;

  let wrapupTimeout = 0;
  let tenant = await Tenant.findById(interaction.tenantId);

  if (!tenant) return;
  //In case user override the tenant configuration , then read wrapup timeout from this
  if (user.overrideUserConf) wrapupTimeout = user.wrapupTimeout;
  else wrapupTimeout = tenant.wrapupTimeout;
  if (wrapupTimeout > 0) {
    winston.info(
      `user ${user.firstname} ${user.lastname} is in wrapup state. State will change to ready after ${wrapupTimeout} seconds`
    );
    setTimeout(switchUserState, wrapupTimeout * 1000, user);
  }
};

const switchUserState = async (user) => {
  let eventManagerList = getEventManager(user);
  //Verify user is existing
  if (!eventManagerList) return;
  if (eventManagerList.length < 1) return;

  if (eventManagerList[0].user.status === "Wrap up") {
    // user still in wrapup state
    winston.info(
      `user ${user.firstname} ${user.lastname} is in wrapup state. State will be changed to ready now`
    );

    changeUserState(await sendAgentState(
      eventManagerList[0],
      { status: "Ready", nextStatus: "Ready" },
      eventManagerList[0].user
    ));
  } else {
    winston.info(
      `User ${eventManagerList[0].user.firstname} ${eventManagerList[0].user.lastname} is in state ${eventManagerList[0].user.status} and timer will be cancelled`
    );
  }
};
