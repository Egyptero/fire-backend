const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const winston = require("winston");
const joi = require("joi");
const config = require("config");
const logUserChange = require("../functions/logger/logUserChange");
//TODO , we need to add different auth layers
//Create new user
router.post("/", async (req, res) => {
  const { error } = validate(req);
  if (error) return res.status(400).send(error.details[0].message);

  const users = await User.find({ email: req.body.email });
  if (users.length < 1)
    return res.status(401).send("Invalid email or password ..");
  const validPassword = await bcrypt.compare(
    req.body.password,
    users[0].password
  );
  if (!validPassword) res.status(401).send("Invalid email or password ..");
  logUserChange(users[0], "Login", users[0]._id.toHexString());
  winston.info("Authenticating User");
  const token = users[0].generateAuthToken();
  return (
    res
      //.header("Access-Control-Allow-Heades", "x-auth-token")
      .header("x-auth-token", token)
      .send({
        data: _.pick(users[0], [
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

function validate(req) {
  const userSchema = {
    password: joi
      .string()
      .min(8)
      .max(200)
      .required(),
    email: joi
      .string()
      .email()
      .required()
  };
  return joi.validate(req.body, userSchema);
}
module.exports = router;
