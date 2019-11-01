const joi = require("joi");
const express = require("express");
const router = express.Router();
const { Interaction } = require("../../../models/interaction");
const verifyInteractionID = require("../../../middleware/verifyInteractionID");

//Create new interaction
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Anybody can post interaction anytime. we assume it is new interaction by default
  //At certain stage , we will need to ensure that same interaction does not exist before.

  const interaction = new Interaction(req.body);
  interaction.tenantId = req.tenantId;
  interaction.skillgroupId = req.skillgroupId;
  interaction.lastModifiedDate = Date.now();

  await interaction.save();
  res.send(interaction);
});

//Update interaction
router.put("/:interactionId", verifyInteractionID, async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);
  req.body.skillgroupId = req.skillgroupId;
  req.body.lastModifiedDate = Date.now();
  const interaction = await Interaction.findByIdAndUpdate(
    req.params.interactionId,
    req.body,
    { new: true }
  );
  if (!interaction) return res.status(404).send("interaction id not found");

  res.send(interaction);
});

//Delete interaction
router.delete("/:interactionId", verifyInteractionID, async (req, res) => {
  const interaction = await Interaction.findByIdAndDelete(
    req.params.interactionId
  );
  if (!interaction) return res.status(404).send("interaction id not found");
  res.send(interaction);
});

//Get interaction by ID
router.get("/:interactionId", verifyInteractionID, async (req, res) => {
  const interaction = await Interaction.findById(req.params.interactionId);
  if (!interaction)
    return res.status(404).send("interaction ID can not be found");
  res.send(interaction);
});

//Get all interactions
router.get("/", async (req, res) => {
  const interactions = await Interaction.find({
    tenantId: req.tenantId,
    skillgroupId: req.skillgroupId
  });
  res.send(interactions);
});

function validate(data) {
  const interactionSchema = {
    fromAddress: joi
      .string()
      .min(3)
      .max(100),
    toAddress: joi
      .string()
      .min(3)
      .max(100),
    ani: joi
      .string()
      .min(3)
      .max(20),
    dnis: joi
      .string()
      .min(3)
      .max(20),
    dialNumber: joi
      .string()
      .min(3)
      .max(20),
    agentId: joi
      .string()
      .min(3)
      .max(100),
    customerId: joi
      .string()
      .min(3)
      .max(100)
      .required(),
    transactionId: joi
      .string()
      .min(3)
      .max(100),
    attached: joi.object(),
    data: joi.object(),
    conversationData: joi.array(),
    lastModifiedDate: joi.date(),
    stage: joi
      .string()
      .min(3)
      .valid([
        "New",
        "Verify",
        "Routing",
        "Reserved",
        "Queue",
        "Offer",
        "Handle",
        "Hold",
        "Error",
        "Close",
        "Terminate",
        "Accept",
        "Reject"
      ]),
    typeId: joi
      .string()
      .min(3)
      .max(100),
    subType: joi
      .string()
      .valid([
        "Comment",
        "Post",
        "Media",
        "Review",
        "DM",
        "Tweet",
        "Mention",
        "Hashtag",
        "Voice",
        "Video",
        "Webrtc"
      ]),
    direction: joi.string().valid(["Inbound", "Outbound"])
  };
  return joi.validate(data, interactionSchema);
}

module.exports = router;
