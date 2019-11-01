const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Interactionlog } = require("../../../models/logs/interactionlog");
const winston = require("winston");
const validateInteractionLogID = require("../../../middleware/validateInteractionLog");
//TODO , we need to add different auth layers
//Create new user

// The full url is /api/ver1.0/tenants/:tenantId/interactions/:interactionId/logs/:interactionLogId
router.get("/:interactionLogId", validateInteractionLogID, async (req, res) => {
  const interactionlog = await Interactionlog.findOne({
    _id: req.params.interactionLogId,
    interactionId: req.interactionId,
    tenantId: req.tenantId
  });
  if (!interactionlog)
    return res.status(404).send("Interaction Log ID can not be found");
  return res.send(interactionlog);
});

// The full url is /api/ver1.0/tenants/:tenantId/interactions/:interactionId/logs
router.get("/", async (req, res) => {
  winston.info(
    `Get all interaction logs for certain interaction ID ${req.interactionId}`
  );
  const interactionLogs = await Interactionlog.find({
    tenantId: req.tenantId,
    interactionId: req.interactionId
  });
  return res.send(interactionLogs);
});

module.exports = router;
