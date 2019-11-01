const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const winston = require("winston");
const logUserChange = require("../functions/logger/logUserChange");
const config = require("config");
const jwt = require("jsonwebtoken");

//Request user activation
router.get("/:token", async (req, res) => {
  if (!req.params.token) return res.status(401).send("Access denid.");

  winston.info("User Activation request reeived and token:" + req.params.token);
  try {
    const decoded = jwt.verify(req.params.token, config.get("jwtPrivateKey"));
    req.user = decoded;
  } catch (ex) {
    return res.status(400).send("Bad request");
  }

  const users = await User.find({ email: req.user.email });
  if (users.length < 1) return res.status(400).send("User not found");
  if (users[0].accountStatus !== "Pending")
    return res.status(404).send("Bad Request");

  let user = new User(users[0]);
  user.accountStatus = "Active";
  user.modifiedBy = req.user._id;
  user.lastModifiedDate = Date.now();

  await user.save();
  logUserChange(users[0], "Activate", users[0]._id.toHexString());
  winston.info("Activating user with email:" + req.user.email);
  return res.status(200).send(
    `
      <script>
  var timeout = 5000;

  setTimeout(function () {
     window.location = "${config.get("frontend")}";
  }, timeout);
</script>
      Temporary password is sent to your email. You can login to firemisc using the sent temporary password.
      We strongly recommend to change the password. Page will be redirected after 5 seconds to firemisc. Please <a href="${config.get(
        "frontend"
      )}">click here</a> to login immidiate`
  );
});

module.exports = router;
