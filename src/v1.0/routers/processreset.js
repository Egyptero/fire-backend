const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const winston = require("winston");
const logUserChange = require("../functions/logger/logUserChange");
const config = require("config");
const jwt = require("jsonwebtoken");
const passwordGenerator = require("generate-password");
const sendTempPasswordEmail = require("../functions/email/sendTempPasswordEmail");

//Request change password to temp password
router.get("/:token", async (req, res) => {
  if (!req.params.token) return res.status(401).send("Access denid.");

  winston.info(
    "User requested Password reset to temporary password. Token:" +
      req.params.token
  );
  try {
    const decoded = jwt.verify(req.params.token, config.get("jwtPrivateKey"));
    req.user = decoded;
  } catch (ex) {
    return res.status(400).send("Bad request");
  }

  const users = await User.find({ email: req.user.email });
  if (users.length < 1) return res.status(400).send("User not found");

  let user = new User(users[0]);
  user.modifiedBy = req.user._id;
  user.lastModifiedDate = Date.now();
  const tempPassword = passwordGenerator.generate({
    length: 10,
    numbers: true
  });
  user.password = tempPassword;
  await user.hashPassword();
  await user.save();
  sendTempPasswordEmail(tempPassword,req.user);
  logUserChange(users[0], "ProcessReset", users[0]._id.toHexString());
  winston.info("Password reset for user with email:" + req.user.email);
  return res.status(200).send(
    `
      <script>
  var timeout = 5000;

  setTimeout(function () {
     window.location = "${config.get("frontend")}";
  }, timeout);
</script>
      Temporary password is sent to your email. You can login to firemisc using the temporary password.
      We strongly recommend to change the password. Page will be redirected after 5 seconds to firemisc. Please <a href="${config.get(
        "frontend"
      )}">click here</a> to login immidiate`
  );
});

module.exports = router;
