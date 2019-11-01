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
    `Assign interaction to agent with id:${interaction._id} and agent id:${
      eventManager.user._id
    }`
  );
  let user = eventManager.user;
  if (!user.interactionIds) user.interactionIds = [];
  if (user.interactionIds) {
    user.interactionIds.forEach((interactionId, index) => {
      if (interactionId === interaction._id)
        user.interactionIds.splice(index, 1);
    });
  }
  user.interactionIds.push(interaction._id);
  switch (interaction.stage) {
    case "Offer":
      buttons.accept = true;
      buttons.reject = true;
      buttons.terminate = true;
      break;
    case "Handle":
      buttons.hold = true;
      buttons.terminate = true;
      buttons.transfer = true;
      buttons.conference = true;
      user.status = "Handling";
      break;
    case "Hold":
      buttons.resume = true;
      buttons.terminate = true;
      buttons.transfer = true;
      buttons.conference = true;
      user.status = "Handling";
      break;
    case "Terminate":
      buttons.close = true;
      user.status = user.nextStatus;
      break;
    default:
      break;
  }

  await user.save();

  let interactionResult = {
    action: "addinteraction",
    message: "Add interaction",
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
