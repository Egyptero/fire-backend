const winston = require("winston");
const mongoose = require("mongoose");
const { Skillgrouplog } = require("../models/logs/skillgrouplog");

module.exports = async (req, res, next) => {
  winston.info("Verify skillgroup log id in the req.params");
  if (!req.params.skillgroupLogId)
    req.params.skillgroupLogId = req.body.skillgroupLogId;
  req.skillgroupLogId = req.params.skillgroupLogId;
  const validSkillgroupLogId = mongoose.Types.ObjectId.isValid(
    req.params.skillgroupLogId
  );
  if (!validSkillgroupLogId)
    return res.status(400).send("Invalid skillgroup log id");

  const skillgroupLog = await Skillgrouplog.findOne({
    _id: req.params.skillgroupLogId
  });
  if (!skillgroupLog)
    return res.status(404).send("No skillgroup log found with the given ID");

  if (skillgroupLog.tenantId != req.tenantId)
    return res.status(403).send("Forbidden Access ...");
  next();
};
