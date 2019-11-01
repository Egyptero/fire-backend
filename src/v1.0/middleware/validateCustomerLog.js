const winston = require("winston");
const mongoose = require("mongoose");
const { Customerlog } = require("../models/logs/customerlog");

module.exports = async (req, res, next) => {
  winston.info("Verify customer log id in the req.params");
  if (!req.params.customerLogId)
    req.params.customerLogId = req.body.customerLogId;
  req.customerLogId = req.params.customerLogId;
  const validCustomerLogId = mongoose.Types.ObjectId.isValid(
    req.params.customerLogId
  );
  if (!validCustomerLogId)
    return res.status(400).send("Invalid customer log id");

  const customerLog = await Customerlog.findOne({
    _id: req.params.customerLogId
  });
  if (!customerLog)
    return res.status(404).send("No customer log found with the given ID");

  if (customerLog.tenantId != req.tenantId)
    return res.status(403).send("Forbidden Access ...");
  next();
};
