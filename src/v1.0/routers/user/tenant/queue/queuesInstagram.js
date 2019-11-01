const express = require("express");
const router = express.Router();
const { Interaction } = require("../../../../models/interaction");
const { Type } = require("../../../../models/type");

router.get("/details", async (req, res) => {
  const user = req.user;
  const types = await Type.find({
    tenantId: req.tenantId,
    channel: { $in: ["Instagram Account", "Instagram DM"] }
  }).select("_id");

  const interactions = await Interaction.find({
    stage: "Queue",
    skillgroupId: { $in: user.skillIds },
    typeId: { $in: types },
    tenantId: req.tenantId
  });
  return res.send(interactions);
});
router.get("/summary", async (req, res) => {
  const user = req.user;
  const types = await Type.find({
    tenantId: req.tenantId,
    channel: { $in: ["Instagram Account", "Instagram DM"] }
  }).select("_id");
  let payload = [];
  if (user.skillIds) {
    await Promise.all(
      user.skillIds.map(async skillId => {
        let queueInteraction = await Interaction.find({
          stage: "Queue",
          skillgroupId: skillId,
          typeId: { $in: types },
          tenantId: req.tenantId
        });
        let queue = queueInteraction.length;

        const commentsQ = queueInteraction.filter(
          interaction => interaction.subType === "Comment"
        ).length;
        const mentionQ = queueInteraction.filter(
          interaction => interaction.subType === "Mention"
        ).length;
        const dmQ = queueInteraction.filter(
          interaction => interaction.subType === "DM"
        ).length;
        if (!queue) queue = 0;
        payload.push({
          skillgroupId: skillId,
          queue,
          commentsQueue: commentsQ,
          mentionsQueue: mentionQ,
          dmQueue: dmQ
        });
      })
    );
  }
  return res.send(payload);
});

module.exports = router;
