const winston = require("winston");
const EventManager = require("./user/EventManager");
const userEvents = require("./user/userEvents");

module.exports.loadServerIO = io => {
  io.on("connection", socket => {
    userEvents.onConnection(socket);
  });
};
