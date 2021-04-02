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
    "status",
    "inStateTime",
  ]);
  let finalResult = users;

  let outCome = await findUsersTeams(users, req.user);
  while (outCome.length > 0) {
    finalResult = _.concat(finalResult, outCome);
    outCome = await findUsersTeams(outCome, req.user);
  }

  return res.send(finalResult);
});
const findUsersTeams = async (users, mainUser) => {
  let outCome = [];
  await Promise.all(
    users.map(async (user) => {
      /** This condition to avoid looping in case the person is the manager of him self */
      if (JSON.stringify(user._id) !== JSON.stringify(mainUser._id))
        outCome = _.concat(outCome, await findUserTeams(user));
    })
  );
  return outCome;
};
const findUserTeams = async (user) => {
  const users = await User.find({ managerId: user._id }).select([
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
    "status",
    "inStateTime",
  ]);
  return users;
};
module.exports = router;
