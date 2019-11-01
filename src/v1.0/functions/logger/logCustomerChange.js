const winston = require("winston");
const { Customerlog, validate } = require("../../models/logs/customerlog");
module.exports = async (customer, action, by) => {
  const data = {
    customerId: customer._id.toHexString(),
    action: action,
    details: {
      by: by,
      data: customer
    }
  };

  const { error } = validate(data);
  if (error)
    return winston.error(
      `Error adding customer log ${error.details[0].message}`
    );
  const customerlog = new Customerlog(data);
  await customerlog.save();
};
