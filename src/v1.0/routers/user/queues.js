const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Skillgroup } = require("../../models/skillgroup");
const { Interaction } = require("../../models/interaction");
const { Type } = require("../../models/type");
const verifySkillgroupID = require("../../middleware/verifySkillgroupID");

//Get skill Queue by ID
router.get("/summary/:skillgroupId", verifySkillgroupID, async (req, res) => {
  //We need to make sure user has access to skill
  let queue = await Interaction.count({
    stage: "Queue",
    skillgroupId: skillgroupId
  });
  if (!queue) queue = 0;
  return res.send({ skillgroupId, queue });
});

//Get all interactions in queue of certain user under all tenants
router.get("/details", async (req, res) => {
  const user = req.user;
  const interactions = await Interaction.find({
    stage: "Queue",
    skillgroupId: { $in: user.skillIds }
  });
  return res.send(interactions);
});

//Get all skills Queues
router.get("/summary", async (req, res) => {
  const user = req.user;
  if (user.skillIds) {
    let payload = [];
    await Promise.all(
      user.skillIds.map(async skillId => {
        let queue = await Interaction.count({
          stage: "Queue",
          skillgroupId: skillId
        });
        if (!queue) queue = 0;
        payload.push({ skillgroupId: skillId, queue });
      })
    );
    return res.send(payload);
  } else return res.send([]);
});

module.exports = router;
