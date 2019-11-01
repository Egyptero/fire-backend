const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");

//Get all skills
router.get("/", async (req, res) => {
  const users = await User.find({ managerId: req.user._id }).select([
    "_id",
    "firstname",
    "lastname",
    "username",
    "email",
    "role",
    "tenantIds",
    "skillIds",
    "interactionIds",
    "mode",
    "managerId",
    "sharedAgent",
    "status"
  ]);
  return res.send(users);
});

module.exports = router;
