const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Userlog } = require("../../models/logs/userlog");
const winston = require("winston");
const validateUserLogID = require("../../middleware/validateUserLog");

// The full url is /api/ver1.0/users/:userId/logs/:userLogId
router.get("/:userLogId", validateUserLogID, async (req, res) => {
  const userlog = await Userlog.findById(req.params.userLogId);
  if (!userlog) return res.status(404).send("User Log ID can not be found");
  return res.send(userlog);
});

// The full url is /api/ver1.0/tenants/:tenantId/users/:userId/logs
router.get("/", async (req, res) => {
  winston.info("Get all users logs request");
  const userLogs = await Userlog.findOne({
    userId: req.userId
  });
  return res.send(userLogs);
});

module.exports = router;
