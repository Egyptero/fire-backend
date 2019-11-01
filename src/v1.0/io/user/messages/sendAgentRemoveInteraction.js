const sendMessage = require("../../system/systemMessages");
const logUserChange = require("../../../functions/logger/logUserChange");
//const { changeUserState } = require("../EventManager");
//const handleChangeState = require("../functions/handleChangeState");
module.exports = async (type, eventManager, interaction) => {
  let buttons = {
    accept: false,
    reject: false,
    hold: false,
    resume: false,
    terminate: false,
    close: false,
    transfer: false,
    conference: false
  };
  console.log(
    `update interaction to agent with id:${interaction._id} and agent id:${
      eventManager.user._id
    }`
  );
  let user = eventManager.user;
  if (user.interactionIds) {
    user.interactionIds.forEach((interactionId, index) => {
      if (interactionId === interaction._id)
        user.interactionIds.splice(index, 1);
    });
  }
  await user.save();

  let interactionResult = {
    action: "removeinteraction",
    message: "Remove interaction",
    interactionDetails: {
      interaction: interaction,
      buttons: { ...buttons }
    },
    interactionIds: user.interactionIds
  };
  // console.log("interaction id:" + interaction._id);
  // console.log(interactionResult);
  sendMessage(eventManager.socket, interactionResult, "Message");
};
