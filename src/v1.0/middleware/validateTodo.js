const winston = require("winston");
const mongoose = require("mongoose");
const { Todo } = require("../models/todo");

module.exports = async (req, res, next) => {
  winston.info("Verify Todo id as todoId in the req.params");
  if (!req.params.todoId) req.params.todoId = req.body.todoId;
  req.todoId = req.params.todoId;
  const validTodoId = mongoose.Types.ObjectId.isValid(req.params.todoId);
  if (!validTodoId) return res.status(400).send("Invalid todo id");

  const todo = await Todo.find({ _id: req.params.todoId });
  if (todo.length < 1)
    return res.status(404).send("No todo found with the given ID");
  next();
};
