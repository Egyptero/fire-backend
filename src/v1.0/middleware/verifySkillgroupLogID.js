const winston = require("winston");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  winston.info("Verify skillgroup log id as skillgroupLogId in the req.params");
  if (!req.params.skillgroupLogId)
    req.params.skillgroupLogId = req.body.skillgroupLogId;
  req.skillgroupLogId = req.params.skillgroupLogId;
  const validSkillgroupLogId = mongoose.Types.ObjectId.isValid(
    req.params.skillgroupLogId
  );
  if (!validSkillgroupLogId)
    return res.status(400).send("Invalid skillgroup log id");
  next();
};
