const winston = require("winston");
const mongoose = require("mongoose");
const { Feedback } = require("../models/feedback");

module.exports = async (req, res, next) => {
  winston.info("Verify id in the req.params");
  if (!req.params.feedbackId) req.params.feedbackId = req.body.feedbackId;
  req.feedbackId = req.params.feedbackId;
  const validFeedbackId = mongoose.Types.ObjectId.isValid(
    req.params.feedbackId
  );
  if (!validFeedbackId) return res.status(400).send("Invalid interaction id");

  const feedback = await Feedback.find({ _id: req.params.feedbackId });
  if (feedback.length < 1)
    return res.status(404).send("No feedback found with the given ID");
  next();
};
