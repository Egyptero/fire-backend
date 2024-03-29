const winston = require("winston");
const validate = require("../validation/messageValidation");

module.exports = (socket, data, event) => {
  winston.info(`Sending notification message ${data}`);
  console.log(data);
  const { error } = validate.validateNotificationMsg(data);

  if (error) {
    console.log("Validation before sending and error is", error);
    socket.emit("Error", {
      message: "Internal Server Error",
      details: error.details[0].message,
      error: error,
    });
    return false;
  }
  //Data is valid , then send the data to the end user
  socket.emit(event, data);
  return true;
};
