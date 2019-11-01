const winston = require("winston");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  winston.info("Verify user log id as userLogId in the req.params");
  if (!req.params.userLogId) req.params.userLogId = req.body.userLogId;
  req.userLogId = req.params.userLogId;
  const validUserLogId = mongoose.Types.ObjectId.isValid(req.params.userLogId);
  if (!validUserLogId) return res.status(400).send("Invalid user log id");
  next();
};
