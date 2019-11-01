const winston = require("winston");
const mongoose = require("mongoose");
const { Userlog } = require("../models/logs/userlog");

module.exports = async (req, res, next) => {
  winston.info("Verify user log id in the req.params");
  if (!req.params.userLogId) req.params.userLogId = req.body.userLogId;
  req.userLogId = req.params.userLogId;
  const validUserLogId = mongoose.Types.ObjectId.isValid(req.params.userLogId);
  if (!validUserLogId) return res.status(400).send("Invalid user log id");

  const userLog = await Userlog.findOne({
    _id: req.params.userLogId
  });
  if (!userLog)
    return res.status(404).send("No user log found with the given ID");
  next();
};
