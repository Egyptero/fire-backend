const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Skillgroup } = require("../../models/skillgroup");
const verifySkillgroupID = require("../../middleware/verifySkillgroupID");

//Get skill by ID
router.get("/:skillgroupId", verifySkillgroupID, async (req, res) => {
  //We need to make sure user has access to skillgroup
  const skillgroup = await Skillgroup.findById(req.params.skillgroupId);
  if (!skillgroup)
    return res.status(404).send("Skillgroup ID can not be found");
  return res.send(skillgroup);
});

//Get all skills
router.get("/", async (req, res) => {
  const user = req.user;
  if (user.skillIds) {
    const skillgroups = await Skillgroup.find({
      _id: { $in: user.skillIds }
    });
    return res.send(skillgroups);
  } else return res.send([]);
});

module.exports = router;
