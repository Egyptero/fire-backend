const winston = require("winston");
const { Workflowlog, validate } = require("../../models/logs/workflowlog");
module.exports = async (workflow, action, by) => {
  const data = {
    workflowId: workflow._id.toHexString(),
    action: action,
    details: {
      by: by,
      data: workflow
    }
  };

  const { error } = validate(data);
  if (error)
    return winston.error(
      `Error adding workflow log ${error.details[0].message}`
    );
  const workflowlog = new Workflowlog(data);
  await workflowlog.save();
};
