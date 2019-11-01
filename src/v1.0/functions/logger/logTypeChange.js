const winston = require("winston");
const { Typelog, validate } = require("../../models/logs/typelog");
module.exports = async (type, action, by) => {
  const data = {
    typeId: type._id.toHexString(),
    action: action,
    details: {
      by: by,
      data: type
    }
  };

  const { error } = validate(data);
  if (error)
    return winston.error(`Error adding type log ${error.details[0].message}`);
  const typelog = new Typelog(data);
  await typelog.save();
};
