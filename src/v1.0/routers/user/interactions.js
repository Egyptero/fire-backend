const _ = require("lodash");
const joi = require("joi");
const express = require("express");
const router = express.Router();
const { Interaction } = require("../../models/interaction");
const verifyCustomerID = require("../../middleware/verifyCustomerID");
const verifyInteractionID = require("../../middleware/verifyInteractionID");
const validateCustomer = require("../../middleware/validateCustomer");
const logInteractionChange = require("../../functions/logger/logInteractionChange");
const startInteractionProcess = require("../../functions/router/startInteractionProcess");
//Create new interaction
router.post("/", validateCustomer, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Anybody can post interaction anytime. we assume it is new interaction by default
  //At certain stage , we will need to ensure that same interaction does not exist before.

  let interaction = new Interaction(req.body);
  interaction.tenantId = req.tenantId;
  interaction.lastModifiedDate = Date.now();

  interaction = await interaction.save();
  logInteractionChange(interaction, "Create", req.user._id);

  //We should start routing from here
  startInteractionProcess(interaction, req.user);
  return res.send(interaction);
});

//Update interaction
router.put(
  "/:interactionId",
  verifyCustomerID,
  verifyInteractionID,
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    req.body.lastModifiedDate = Date.now();
    const interaction = await Interaction.findByIdAndUpdate(
      req.params.interactionId,
      req.body,
      { new: true }
    );
    if (!interaction) return res.status(404).send("interaction id not found");
    logInteractionChange(interaction, "Update", req.user._id);
    return res.send(interaction);
  }
);

//Get interaction by ID
router.get("/:interactionId", verifyInteractionID, async (req, res) => {
  const interaction = await Interaction.findById(req.params.interactionId);
  if (!interaction)
    return res.status(404).send("interaction ID can not be found");
  logInteractionChange(interaction, "Read", req.user._id);
  return res.send(interaction);
});

//Get all interactions
router.get("/", async (req, res) => {
  const interactions = await Interaction.find({ tenantId: req.tenantId });
  return res.send(interactions);
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
    skillgroupId: joi.string(),
    agentId: joi
      .string()
      .min(3)
      .max(100),
    transactionId: joi
      .string()
      .min(3)
      .max(100),
    attached: joi.object(),
    data: joi.object(),
    conversationData: joi.array(),
    creationDate: joi.date(),
    lastModifiedDate: joi.date(),
    schedule: joi.date(),
    createdBy: joi.string().min(3),
    modifiedBy: joi.string().min(3),
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
    typeId: joi.string().min(3),
    customerId: joi.string().min(3)
  };
  return joi.validate(data, interactionSchema);
}

module.exports = router;
