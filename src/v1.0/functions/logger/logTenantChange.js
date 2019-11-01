const winston = require("winston");
const { Tenantlog, validate } = require("../../models/logs/tenantlog");
module.exports = async (tenant, action, by) => {
  const data = {
    tenantId: tenant._id.toHexString(),
    action: action,
    details: {
      by: by,
      data: tenant
    }
  };

  const { error } = validate(data);
  if (error)
    return winston.error(`Error adding tenant log ${error.details[0].message}`);
  const tenantlog = new Tenantlog(data);
  await tenantlog.save();
};
