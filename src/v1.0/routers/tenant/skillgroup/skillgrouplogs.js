const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Skillgrouplog } = require("../../../models/logs/skillgrouplog");
const winston = require("winston");
const validateSkillgroupLogID = require("../../../middleware/validateSkillgroupLog");

// The full url is /api/ver1.0/tenants/:tenantId/skillgroups/:skillgroupId/logs/:skillgroupLogId
router.get("/:skillgroupLogId", validateSkillgroupLogID, async (req, res) => {
  const skillgrouplog = await Skillgrouplog.findById(
    req.params.skillgroupLogId
  );
  if (!skillgrouplog)
    return res.status(404).send("Skillgroup Log ID can not be found");
  return res.send(skillgrouplog);
});

// The full url is /api/ver1.0/tenants/:tenantId/skillgroups/:skillgroupId/logs
router.get("/", async (req, res) => {
  winston.info("Get all skillgroups logs request");
  const skillgroupLogs = await Skillgrouplog.find({
    tenantId: req.tenantId,
    skillgroupId: req.skillgroupId
  });
  return res.send(skillgroupLogs);
});

module.exports = router;
