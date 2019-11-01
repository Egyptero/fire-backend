const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const winston = require("winston");
const logUserChange = require("../functions/logger/logUserChange");
const sendPasswordResetEmail = require("../functions/email/sendPasswordResetEmail");

//Request Password Reset Email
router.post("/:email", async (req, res) => {
  const users = await User.find({ email: req.params.email });
  if (users.length < 1) return res.status(404).send("Bad request");
  logUserChange(users[0], "RequestReset", users[0]._id.toHexString());
  winston.info("Sending password reset email to:" + req.params.email);

  const token = users[0].generateAuthToken();
  sendPasswordResetEmail(token, users[0]);
  return res.status(200).send();
});

module.exports = router;
