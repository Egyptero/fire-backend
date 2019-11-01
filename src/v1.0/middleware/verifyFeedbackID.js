const winston = require("winston");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  winston.info("Verify feedback id as feedbackId in the req.params");
  if (!req.params.feedbackId) req.params.feedbackId = req.body.feedbackId;
  req.feedbackId = req.params.feedbackId;
  const validFeedbackId = mongoose.Types.ObjectId.isValid(
    req.params.feedbackId
  );
  if (!validFeedbackId) return res.status(400).send("Invalid feedback id");
  next();
};
