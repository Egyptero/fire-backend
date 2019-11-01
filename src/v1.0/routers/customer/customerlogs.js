const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Customerlog } = require("../../models/logs/customerlog");
const winston = require("winston");
const validateCustomerLogID = require("../../middleware/validateCustomerLog");

// The full url is /api/ver1.0/tenants/:tenantId/customerlogs/:customerLogId
router.get("/:customerLogId", validateCustomerLogID, async (req, res) => {
  const customerlog = await Customerlog.findById(req.params.customerLogId);
  if (!customerlog)
    return res.status(404).send("Customer Log ID can not be found");
  return res.send(customerlog);
});

// The full url is /api/ver1.0/tenants/:tenantId/customerlogs
router.get("/", async (req, res) => {
  winston.info("Get all customers logs request");
  const customerLogs = await Customerlog.find({
    customerId: req.customerId
  });
  return res.send(customerLogs);
});

module.exports = router;
