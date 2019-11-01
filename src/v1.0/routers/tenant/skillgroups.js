const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Skillgroup, validate } = require("../../models/skillgroup");
const validateSkillgroup = require("../../middleware/validateSkillgroup");
const logSkillgroupChange = require("../../functions/logger/logSkillgroupChange");
//Create new skill
router.post("/", async (req, res) => {
  req.body.tenantId = req.tenantId;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let skillgroup = await Skillgroup.find({ name: req.body.name }).and({
    tenantId: req.body.tenantId
  });
  if (skillgroup.length > 0)
    return res.status(400).send("Same skillname already exist");
  skillgroup = new Skillgroup(req.body);
  await skillgroup.save();
  logSkillgroupChange(skillgroup, "Create", req.user._id);
  return res.send(skillgroup);
});

//Update skill
router.put("/:skillgroupId", validateSkillgroup, async (req, res) => {
  req.body.tenantId = req.tenantId;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const skillgroup = await Skillgroup.findByIdAndUpdate(
    req.params.skillgroupId,
    req.body,
    { new: true }
  );
  if (!skillgroup) return res.status(404).send("Skillgroup id not found");
  logSkillgroupChange(skillgroup, "Update", req.user._id);
  return res.send(skillgroup);
});

//Delete skill
router.delete("/:skillgroupId", validateSkillgroup, async (req, res) => {
  const skillgroup = await Skillgroup.findByIdAndDelete(
    req.params.skillgroupId
  );
  if (!skillgroup) return res.status(404).send("Skillgroup id not found");
  logSkillgroupChange(skillgroup, "Delete", req.user._id);
  return res.send(skillgroup);
});

//Get skill by ID
router.get("/:skillgroupId", validateSkillgroup, async (req, res) => {
  const skillgroup = await Skillgroup.findById(req.params.skillgroupId);
  if (!skillgroup)
    return res.status(404).send("Skillgroup ID can not be found");
  logSkillgroupChange(skillgroup, "Read", req.user._id);
  return res.send(skillgroup);
});

//Get all skills
router.get("/", async (req, res) => {
  const skillgroups = await Skillgroup.find({ tenantId: req.tenantId });
  return res.send(skillgroups);
});

module.exports = router;
