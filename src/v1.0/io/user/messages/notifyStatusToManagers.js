const winston = require("winston");
const notifyMessage = require("../../system/notifyMessage");
const eventManager = require("../EventManager");
module.exports = async (user) => {
  winston.info(
    `Request to send status message to managers of user: ${user.firstname} ${user.lastname}`
  );
  winston.info(`Manager ID : ${JSON.stringify(user.managerId)}`);
  let notifyResult = {
    action: "Error",
    message: "",
    users: [], // user updates
    queues: [], // queue updates
    kpis:[]
  };

  const eventManagerList = eventManager.getEventManager({_id:user.managerId});
  if (eventManagerList.length > 0) {
      managerEventManager = eventManagerList[0];
      notifyResult.message = "Success";
      notifyResult.action = "Notify";
      notifyResult.users.push(user);
      notifyMessage(managerEventManager.socket,notifyResult,"Notify");
  } else return;
};
