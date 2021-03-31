const winston = require("winston");
const notifyMessage = require("../../system/notifyMessage");
const eventManager = require("../EventManager");
const _ = require("lodash");

module.exports = async (user) => {
  winston.info(
    `Request to send status message to managers of user: ${user.firstname} ${user.lastname}`
  );
  winston.info(`Manager ID : ${JSON.stringify(user.managerId)}`);
  if (!user.managerId) return;
  let notifyResult = {
    action: "Error",
    message: "",
    users: [], // user updates
    queues: [], // queue updates
    kpis: [],
  };
  let currentUser = _.cloneDeep(user);
  while (currentUser.managerId) {
    const eventManagerList = eventManager.getEventManager({
      _id: currentUser.managerId,
    });
    if (eventManagerList.length > 0) {
      managerEventManager = eventManagerList[0];
      notifyResult.message = "Success";
      notifyResult.action = "Notify";
      notifyResult.users.push(
        _.pick(currentUser, [
          "_id",
          "firstname",
          "lastname",
          "username",
          "email",
          "role",
          "tenantIds",
          "skillIds",
          "interactionIds",
          "mode",
          "managerId",
          "sharedAgent",
          "status",
          "inStateTime",
        ])
      );
      notifyMessage(managerEventManager.socket, notifyResult, "Notify");
      winston.info(
        `notify manager name ${managerEventManager.user.firstname} about user ${currentUser.firstname}`
      );
      currentUser = _.cloneDeep(managerEventManager.user);
      if (currentUser.role == "Administrator") return; // Max level is admin
    } else return;
  }
};
