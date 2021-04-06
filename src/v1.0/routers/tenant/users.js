const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");
const validateUser = require("../../middleware/validateUser");
const joi = require("joi");
const logUserChange = require("../../functions/logger/logUserChange");
//Create new user
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.find({ username: req.body.username }).or({
    email: req.body.email,
  });
  if (user.length > 0)
    return res.status(400).send("Username or email already exist");

  user = new User(req.body);

  user.createdBy = req.user._id;
  user.modifiedBy = req.user._id;
  user.creationDate = Date.now();
  user.lastModifiedDate = Date.now();

  await user.hashPassword();
  user.tenantIds.push(req.tenantId);
  await user.save();
  logUserChange(user, "Create", req.user._id);
  return res.send(
    _.pick(user, [
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
      "overrideUserConf",
      "overrideKPIsConf",
    ])
  );
});

//Update user
router.put("/:userId", validateUser, async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
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
      "overrideUserConf",
      "overrideKPIsConf",
    ])
  );
});

//Delete user
router.delete("/:userId", validateUser, async (req, res) => {
  let user = await User.findByIdAndDelete(req.params.userId);
  if (!user) return res.status(404).send("User id not found");
  logUserChange(user, "Delete", req.user._id);
  return res.send(
    _.pick(user, [
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
      "overrideUserConf",
      "overrideKPIsConf",
    ])
  );
});

//Get user by ID
router.get("/:userId", validateUser, async (req, res) => {
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
      "overrideUserConf",
      "overrideKPIsConf",
    ])
  );
});

//Get all users
router.get("/", async (req, res) => {
  const users = await User.find({ tenantIds: req.tenantId }).select([
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
    "overrideUserConf",
    "overrideKPIsConf",
  ]);
  return res.send(users);
});

function validate(data) {
  const schema = {
    firstname: joi.string().min(3).max(20),
    lastname: joi.string().min(3).max(20),
    username: joi.string().min(5).required(),
    password: joi.string().min(8).max(200).required(),
    email: joi.string().email().required(),
    role: joi
      .string()
      .min(3)
      .valid(
        "User",
        "Agent",
        "Supervisor",
        "Leader",
        "Business",
        "Administrator"
      ),
  };
  return joi.validate(data, schema);
}
function validateUpdate(data) {
  const schema = {
    firstname: joi.string().min(3).max(20),
    lastname: joi.string().min(3).max(20),
    username: joi.string().min(5).optional(),
    password: joi.string().min(8).max(200).optional(),
    email: joi.string().email().optional(),
    role: joi
      .string()
      .min(3)
      .valid(
        "User",
        "Agent",
        "Supervisor",
        "Leader",
        "Business",
        "Administrator"
      )
      .optional(),
    sharedAgent: joi.boolean(),
    otherEmails: joi.array().valid(joi.string().email()),
    skillIds: joi.array(),
    tenantIds: joi.array(),
    mode: joi.string().valid(["Push", "Pull", "Mix"]),
    managerId: joi.string().allow(["", null]),
    inStateTime: joi.date(),
    odi: joi.boolean(),
    phone: joi.boolean(),
    sipUri: joi.string(),
    sipServer: joi.string(),
    sipUserName: joi.string(),
    sipPassword: joi.string(),
    type: joi.string().valid(["User", "Company"]).optional(),
    notifications: joi.boolean(),
    autoAccept: joi.boolean(),
    wrapup: joi.boolean(),
    workbin: joi.boolean(),
    autoLogin: joi.boolean(),
    interactionCapacity: joi.number(),
    caseCapacity: joi.number(),
    offerTimeout: joi.number(),
    wrapupTimeout: joi.number(),
    dailyInteractionTarget: joi.number(),
    dailyCaseTarget: joi.number(),
    dailyUtilizationTarget: joi.number(),
    offlineASATarget: joi.number(),
    onlineASATarget: joi.number(),
    overrideUserConf: joi.boolean(),
    overrideKPIsConf: joi.boolean(),

    //sipStatus: joi.string().valid(["Unknown", "Connected", "Disconnected"])
  };
  return joi.validate(data, schema);
}
module.exports = router;
