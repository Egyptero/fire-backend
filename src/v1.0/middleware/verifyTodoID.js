const winston = require("winston");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  winston.info("Verify todo id as todoId in the req.params");
  if (!req.params.todoId) req.params.todoId = req.body.todoId;
  req.todoId = req.params.todoId;
  const validTodoId = mongoose.Types.ObjectId.isValid(req.params.todoId);
  if (!validTodoId) return res.status(400).send("Invalid todo id");
  next();
};
