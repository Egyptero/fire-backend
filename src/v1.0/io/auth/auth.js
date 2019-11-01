const winston = require("winston");
const jwt = require("jsonwebtoken");
const config = require("config");
/*
 * Function to authenticate the client according to the sent token
 * this function will return json object with the following
 * error parameter to define if there is an error. In case of error a message is attached in the same object
 * in case of valid auth the decoded will have the original user data
 */
module.exports = data => {
  let result = {
    error: false,
    decoded: null,
    message: ""
  };

  if (!data.token) {
    result.error = true;
    result.message = "Missing token";
    return result;
  }
  try {
    const decoded = jwt.verify(data.token, config.get("jwtPrivateKey"));
    result.decoded = decoded;
    return result;
  } catch (ex) {
    result.error = true;
    result.message = "Invalid token";
    return result;
  }
};
