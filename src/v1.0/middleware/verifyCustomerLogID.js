const winston = require("winston");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  winston.info("Verify customer log id as customerLogId in the req.params");
  if (!req.params.customerLogId)
    req.params.customerLogId = req.body.customerLogId;
  req.customerLogId = req.params.customerLogId;
  const validCustomerLogId = mongoose.Types.ObjectId.isValid(
    req.params.customerLogId
  );
  if (!validCustomerLogId)
    return res.status(400).send("Invalid customer log id");
  next();
};
