const express = require("express");
const router = express.Router();
const { Interaction } = require("../../../../models/interaction");
const { Type } = require("../../../../models/type");

router.get("/details", async (req, res) => {
  const user = req.user;
  const types = await Type.find({
    tenantId: req.tenantId,
    channel: { $in: ["Voice", "Vedio", "Webrtc"] }
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
    channel: { $in: ["Voice", "Vedio", "Webrtc"] }
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

        const inboundQ = queueInteraction.filter(
          interaction => interaction.direction === "Inbound"
        ).length;
        const outboundQ = queueInteraction.filter(
          interaction => interaction.direction === "Outbound"
        ).length;
        if (!queue) queue = 0;
        payload.push({
          skillgroupId: skillId,
          queue,
          InboundQueue: inboundQ,
          OutboundQueue: outboundQ
        });
      })
    );
  }
  return res.send(payload);
});

module.exports = router;
