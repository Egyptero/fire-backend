const express = require("express");
const router = express.Router();
const { Interaction, validate } = require("../models/interaction");
const auth = require("../middleware/auth");
const validateTenant = require("../middleware/validateTenant");
const verifyTenantID = require("../middleware/verifyTenantID");
const verifyCustomerID = require("../middleware/verifyCustomerID");
const validateCustomer = require("../middleware/validateCustomer");
const verifyInteractionID = require("../middleware/verifyInteractionID");
const shouldBeSysAdmin = require("../middleware/auth/shouldBeSysAdmin");
const logInteractionChange = require("../functions/logger/logInteractionChange");

//Create new interaction
router.post("/", validateTenant, validateCustomer, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Anybody can post interaction anytime. we assume it is new interaction by default
  //At certain stage , we will need to ensure that same interaction does not exist before.

  const interaction = new Interaction(req.body);
  await interaction.save();
  logInteractionChange(interaction, "Create", req.user._id);
  return res.send(interaction);
});

//Update interaction
router.put(
  "/:interactionId",
  verifyInteractionID,
  verifyTenantID,
  verifyCustomerID,
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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

//Delete interaction
router.delete("/interactionId", verifyInteractionID, async (req, res) => {
  const interaction = await Interaction.findByIdAndDelete(
    req.params.interactionId
  );
  if (!interaction) return res.status(404).send("interaction id not found");
  logInteractionChange(interaction, "Delete", req.user._id);
  return res.send(interaction);
});

//Get interaction by ID
router.get("/interactionId", verifyInteractionID, async (req, res) => {
  const interaction = await Interaction.findById(req.params.interactionId);
  if (!interaction)
    return res.status(404).send("interaction ID can not be found");
  logInteractionChange(interaction, "Read", req.user._id);
  return res.send(interaction);
});

//Get all interactions
router.get("/", async (req, res) => {
  const interactions = await Interaction.find();
  return res.send(interactions);
});

module.exports = router;
