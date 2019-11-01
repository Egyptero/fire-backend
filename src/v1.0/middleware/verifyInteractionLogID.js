const winston = require("winston");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  winston.info(
    "Verify interaction log id as interactionLogId in the req.params"
  );
  if (!req.params.interactionLogId)
    req.params.interactionLogId = req.body.interactionLogId;
  req.interactionLogId = req.params.interactionLogId;
  const validInteractionLogId = mongoose.Types.ObjectId.isValid(
    req.params.interactionLogId
  );
  if (!validInteractionLogId)
    return res.status(400).send("Invalid interaction log id");
  next();
};
