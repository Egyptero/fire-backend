const winston = require("winston");
const { validateOutput } = require("../validation/messageValidation");

module.exports = (socket, data, event) => {
  const { error } = validateOutput(data);
  if (error) {
    socket.emit("Error", {
      message: "Internal Server Error",
      details: error.details[0].message,
      error: error
    });
    return false;
  }
  //Data is valid , then send the data to the end user
  socket.emit(event, data);
  return true;
};
