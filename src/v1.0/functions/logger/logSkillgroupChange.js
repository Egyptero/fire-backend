const winston = require("winston");
const { Skillgrouplog, validate } = require("../../models/logs/skillgrouplog");
module.exports = async (skillgroup, action, by) => {
  let data = {
    skillgroupId: skillgroup._id.toHexString(),
    action: action,
    details: {
      by: by,
      data: skillgroup
    }
  };
  if (skillgroup.tenantId) data.tenantId = skillgroup.tenantId.toHexString();
  const { error } = validate(data);
  if (error)
    return winston.error(
      `Error adding skillgroup log ${error.details[0].message}`
    );
  const skillgrouplog = new Skillgrouplog(data);
  await skillgrouplog.save();
};
