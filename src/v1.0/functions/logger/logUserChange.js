const winston = require("winston");
const { Userlog, validate } = require("../../models/logs/userlog");
module.exports = async (user, action, by) => {
  const data = {
    userId: user._id.toHexString(),
    action: action,
    details: {
      by: by,
      data: user
    }
  };

  const { error } = validate(data);
  if (error)
    return winston.error(`Error adding user log ${error.details[0].message}`);
  const userlog = new Userlog(data);
  await userlog.save();
};
