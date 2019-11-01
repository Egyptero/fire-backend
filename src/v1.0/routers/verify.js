const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const winston = require("winston");
const logUserChange = require("../functions/logger/logUserChange");
const sendUserVerificationEmail = require("../functions/email/sendUserVerificationEmail");

//Request user verification email
router.post("/", async (req, res) => {
  const users = await User.find({ email: req.user.email });
  if (users.length < 1) return res.status(400).send("User not found");
  if (users[0].accountStatus !== "Pending")
    return res.status(404).send("Bad Request");
  logUserChange(users[0], "Verify", users[0]._id.toHexString());
  winston.info("Sending user verification email to:" + req.user.email);

  const token = users[0].generateAuthToken();
  sendUserVerificationEmail(token, users[0]);
  return res.status(200).send();
});

module.exports = router;
