const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Skillgroup } = require("../../../models/skillgroup");
const { Interaction } = require("../../../models/interaction");
const { Type } = require("../../../models/type");
const verifySkillgroupID = require("../../../middleware/verifySkillgroupID");

//Get skill Queue by ID
router.get("/summary/:skillgroupId", verifySkillgroupID, async (req, res) => {
  //We need to make sure user has access to skill
  let queue = await Interaction.count({
    stage: "Queue",
    skillgroupId: skillgroupId,
    tenantId: req.tenantId
  });
  if (!queue) queue = 0;
  return res.send({ skillgroupId, queue });
});

//Get all interaction details under user under all skill groups under certain tenant
router.get("/details", async (req, res) => {
  const user = req.user;
  const interactions = await Interaction.find({
    stage: "Queue",
    skillgroupId: { $in: user.skillIds },
    tenantId: req.tenantId
  });
  return res.send(interactions);
});

//Get all skills Queues under certain tenant
// The output should be formated as
/**
 * {
 *  skillgroupId:xxxxx,
 *  queue : 10
 * }
 */
router.get("/summary", async (req, res) => {
  const user = req.user;
  console.log("Request received for Queue summary under tenant");
  if (user.skillIds) {
    let payload = [];
    await Promise.all(
      user.skillIds.map(async skillId => {
        let queue = await Interaction.count({
          stage: "Queue",
          skillgroupId: skillId,
          tenantId: req.tenantId
        });
        if (!queue) queue = 0;
        payload.push({ skillgroupId: skillId, queue });
      })
    );
    return res.send(payload);
  } else return res.send([]);
});

module.exports = router;
