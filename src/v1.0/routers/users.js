const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const winston = require("winston");
const auth = require("../middleware/auth");
const verifyUserID = require("../middleware/verifyUserID");
const shouldBeSysAdmin = require("../middleware/auth/shouldBeSysAdmin");
const logUserChange = require("../functions/logger/logUserChange");

//TODO , we need to add different auth layers
//Create new user
router.post("/", async (req, res) => {
  console.log("a New user creation request");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.find({ username: req.body.username }).or({
    email: req.body.email,
  });
  if (user.length > 0)
    return res.status(404).send("Username or email already exist");

  user = new User(req.body);
  user.createdBy = user._id;
  user.modifiedBy = user._id;
  user.creationDate = Date.now();
  user.lastModifiedDate = Date.now();

  await user.hashPassword();
  await user.save();
  logUserChange(user, "Create", user._id.toHexString());
  const token = user.generateAuthToken();

  return (
    res
      //.header("Access-Control-Allow-Heades", "x-auth-token")
      .header("x-auth-token", token)
      .send({
        data: _.pick(user, [
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
          "inStateTime",
          "odi",
          "phone",
          "sipUri",
          "sipServer",
          "sipUserName",
          "sipPassword",
          "sipStatus",
          "accountStatus",
          "accountType",
          "receiveUpdates",
          "notifications",
          "autoAccept",
          "wrapup",
          "workbin",
          "autoLogin",
          "interactionCapacity",
          "caseCapacity",
          "offerTimeout",
          "wrapupTimeout",
          "dailyInteractionTarget",
          "dailyCaseTarget",
          "dailyUtilizationTarget",
          "offlineASATarget",
          "onlineASATarget",
      
        ]),
        token,
      })
  );

  // return res
  //   .header("x-auth-token", token)
  //   .send(
  //     _.pick(user, [
  //       "_id",
  //       "firstname",
  //       "lastname",
  //       "username",
  //       "email",
  //       "role",
  //       "tenantIds",
  //       "skillgroupIds"
  //     ])
  //   );
});

//Update user
router.put(
  "/:userId",
  auth,
  shouldBeSysAdmin,
  verifyUserID,
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    if (req.body.password) {
      bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password);
    }
    //TODO , we need to review the lastmodifieddate , and modifiedby parameters before complete the saving
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
    });
    if (!user) return res.status(404).send("User id not found");
    logUserChange(user, "Update", req.user._id);
    return res.send(
      _.pick(user, [
        "_id",
        "firstname",
        "lastname",
        "username",
        "email",
        "role",
      ])
    );
  }
);

//Delete user
router.delete(
  "/:userId",
  auth,
  shouldBeSysAdmin,
  verifyUserID,
  async (req, res) => {
    let user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("User id not found");
    await user.delete();
    logUserChange(user, "Delete", req.user._id);
    return res.send(
      _.pick(user, [
        "_id",
        "firstname",
        "lastname",
        "username",
        "email",
        "role",
      ])
    );
  }
);

//Get user by ID
router.get(
  "/:userId",
  auth,
  shouldBeSysAdmin,
  verifyUserID,
  async (req, res) => {
    winston.info("Get user request");
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("User ID can not be found");
    logUserChange(user, "Read", req.user._id);
    return res.send(
      _.pick(user, [
        "_id",
        "firstname",
        "lastname",
        "username",
        "email",
        "role",
      ])
    );
  }
);

//Get all users
router.get("/", auth, shouldBeSysAdmin, async (req, res) => {
  winston.info("Get all users request");
  const users = await User.find().select([
    "_id",
    "firstname",
    "lastname",
    "username",
    "email",
    "role",
  ]);
  return res.send(users);
});

module.exports = router;
