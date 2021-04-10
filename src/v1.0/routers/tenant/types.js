const joi = require("joi");
const express = require("express");
const router = express.Router();
const { Type } = require("../../models/type");
const verifyTypeID = require("../../middleware/verifyTypeID");
const logTypeChange = require("../../functions/logger/logTypeChange");
const _ = require("lodash");
//Create new type
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // User can create as many types as possible , we may need to avoid same name of type for the same tenant.
  type = new Type(req.body);
  type.tenantId = req.tenantId;

  await type.save();
  logTypeChange(type, "Create", req.user._id);
  return res.send(type);
});

//Update type
router.put("/:typeId", verifyTypeID, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const type = await Type.findByIdAndUpdate(req.params.typeId, req.body, {
    new: true,
  });
  if (!type) return res.status(404).send("type id not found");
  logTypeChange(type, "Update", req.user._id);
  return res.send(type);
});

//Delete type , We should't delete the type , we should remove only the tenant id
router.delete("/:typeId", verifyTypeID, async (req, res) => {
  let type = await Type.findByIdAndDelete(req.params.typeId);
  if (!type) return res.status(404).send("type id not found");
  logTypeChange(type, "Delete", req.user._id);
  return res.send(type);
});

//Get type by ID
router.get("/:typeId", verifyTypeID, async (req, res) => {
  const type = await Type.findById(req.params.typeId);
  if (!type) return res.status(404).send("type ID can not be found");
  logTypeChange(type, "Read", req.user._id);
  return res.send(type);
});

//Get all types
router.get("/", async (req, res) => {
  //We should find only types of the incoming tenant
  //TODO , We have a bug here
  if (req.body && !_.isEmpty(req.body)) {
    console.log(
      "Some how we are here , so req.body:" + JSON.stringify(req.body)
    );
    const { error } = validateGet(req.body);
    if (error) {
      const types = await Type.find({ tenantId: req.tenantId });
      return res.send(types);
    }
    req.body.tenantId = req.tenantId;
    const types = await Type.find({ types });
    return res.send(types);
  }
  const types = await Type.find({ tenantId: req.tenantId });
  return res.send(types);
});
function validateGet(data) {
  const typeSchema = {
    name: joi.string().min(3).max(20),
    description: joi.string().max(2048),
    channel: joi
      .string()
      .valid([
        "Facebook Page",
        "Facebook DM",
        "Twitter Account",
        "Twitter DM",
        "Intsagram Account",
        "WhatsApp Business",
        "LinkedIn",
        "Youtube",
        "Voice",
        "Vedio",
        "SMS",
        "Chat",
        "Email",
        "Webrtc",
        "Project",
        "Custom",
      ]),
    workflowId: joi.string(),
  };
  return joi.validate(data, typeSchema);
}
function validate(data) {
  const typeSchema = {
    name: joi.string().min(3).max(20).required(),
    description: joi.string().max(2048),
    channel: joi
      .string()
      .valid([
        "Facebook Page",
        "Facebook DM",
        "Twitter Account",
        "Twitter DM",
        "Instagram Account",
        "Instagram DM",
        "WhatsApp Business",
        "LinkedIn",
        "Youtube",
        "Voice",
        "Vedio",
        "SMS",
        "Chat",
        "Email",
        "Webrtc",
        "Project",
        "Custom",
      ])
      .required(),
    workflowId: joi.string(),
    configuration: joi.object(),
  };
  return joi.validate(data, typeSchema);
}

module.exports = router;
