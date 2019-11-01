const joi = require("joi");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");
const logUserChange = require("../../functions/logger/logUserChange");
//TODO , we need to add different auth layers
//Renew token
router.post("/", async (req, res) => {
  //We should revert back with user details

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send("User not found , please relogin ..");
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
          "type"
        ]),
        token
      })
  );
});

//Update user
router.put("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, {
    new: true
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
      "type"
    ])
  );
});

//Delete user
// router.delete("/", async (req, res) => {
//   let user = await User.findById(req.user._id);
//   if (!user) return res.status(404).send("User id not found");
//   await user.delete();
//   logUserChange(user, "Delete", req.user._id);
//   return res.send(
//     _.pick(user, [
//       "_id",
//       "firstname",
//       "lastname",
//       "username",
//       "email",
//       "role",
//       "tenantIds",
//       "skillIds",
//       "interactionIds",
//       "mode",
//       "managerId",
//       "sharedAgent"
//     ])
//   );
// });

//Get user by ID
router.get("/", async (req, res) => {
  const user = await User.findById(req.user._id);
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
      "receiveUpdates"
    ])
  );
});

function validate(data) {
  const schema = {
    firstname: joi
      .string()
      .min(3)
      .max(20),
    lastname: joi
      .string()
      .min(3)
      .max(20),
    username: joi
      .string()
      .min(5)
      .optional(),
    password: joi
      .string()
      .min(8)
      .max(200)
      .optional(),
    email: joi
      .string()
      .email()
      .optional(),
    sharedAgent: joi.boolean(),
    otherEmails: joi.array().valid(joi.string().email()),
    sipUri: joi.string().allow([null, ""]),
    sipServer: joi.string().allow([null, ""]),
    sipUserName: joi.string().allow([null, ""]),
    sipPassword: joi.string().allow([null, ""]),
    receiveUpdates: joi.boolean(),
    type: joi
      .string()
      .valid(["User", "Company"])
      .optional()
  };
  return joi.validate(data, schema);
}
module.exports = router;
