const winston = require("winston");
const notifyMessage = require("../../system/notifyMessage");
const eventManager = require("../EventManager");
const _ = require("lodash");
const { User } = require("../../../models/user");

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
      notifyResult.users = [];
      notifyResult.users.push(
        _.pick(user, [
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
        `notify manager name ${managerEventManager.user.firstname} ${managerEventManager.user.lastname} about user ${user.firstname} ${user.lastname}`
      );
      currentUser = _.cloneDeep(managerEventManager.user);

      //
      if (
        currentUser.role == "Administrator" ||
        JSON.stringify(currentUser._id) ===
          JSON.stringify(currentUser.managerId)
      )
        return; // Max level is admin
    } else {
      currentUser = await User.findById(currentUser.managerId);
      if(!currentUser) return;
    }
  }
};
