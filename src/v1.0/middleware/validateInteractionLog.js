const winston = require("winston");
const mongoose = require("mongoose");
const { Interactionlog } = require("../models/logs/interactionlog");

module.exports = async (req, res, next) => {
  winston.info("Verify interaction log id in the req.params");
  if (!req.params.interactionLogId)
    req.params.interactionLogId = req.body.interactionLogId;
  req.interactionLogId = req.params.interactionLogId;
  const validInteractionLogId = mongoose.Types.ObjectId.isValid(
    req.params.interactionLogId
  );
  if (!validInteractionLogId)
    return res.status(400).send("Invalid intraction log id");

  const interactionLog = await Interactionlog.findOne({
    _id: req.params.interactionLogId
  });
  if (!interactionLog)
    return res.status(404).send("No interaction log found with the given ID");

  if (interactionLog.tenantId != req.tenantId)
    return res.status(403).send("Forbidden Access ...");
  next();
};
