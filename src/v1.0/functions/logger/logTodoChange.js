const winston = require("winston");
const { Todolog, validate } = require("../../models/logs/todolog");
module.exports = async (todo, action, by) => {
  const data = {
    todoId: todo._id.toHexString(),
    action: action,
    details: {
      by: by,
      data: todo
    }
  };

  const { error } = validate(data);
  if (error)
    return winston.error(`Error adding todo log ${error.details[0].message}`);
  const todolog = new Todolog(data);
  await todolog.save();
};
