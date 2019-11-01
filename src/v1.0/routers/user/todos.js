const joi = require("joi");
const express = require("express");
const router = express.Router();
const { Todo, validate, validateUpdate } = require("../../models/todo");
const verifyTodoID = require("../../middleware/verifyTodoID");
const logTodoChange = require("../../functions/logger/logTodoChange");

//Create new todo
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // User can create as many todos as possible , we may need to avoid same name of todo for the same user.
  todo = new Todo(req.body);
  todo.userId = req.user._id;

  await todo.save();
  logTodoChange(todo, "Create", req.user._id);
  return res.send(todo);
});

//Update todo
router.put("/:todoId", verifyTodoID, async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const todo = await Todo.findByIdAndUpdate(req.params.todoId, req.body, {
    new: true
  });
  if (!todo) return res.status(404).send("todo id not found");
  logTodoChange(todo, "Update", req.user._id);
  return res.send(todo);
});

//Delete todo , We should't delete the todo , we should remove only the user id
router.delete("/:todoId", verifyTodoID, async (req, res) => {
  let todo = await Todo.findByIdAndDelete(req.params.todoId);
  if (!todo) return res.status(404).send("todo id not found");
  logTodoChange(todo, "Delete", req.user._id);
  return res.send(todo);
});

//Get todo by ID
router.get("/:todoId", verifyTodoID, async (req, res) => {
  const todo = await Todo.findById(req.params.todoId);
  if (!todo) return res.status(404).send("todo ID can not be found");
  //  logTodoChange(todo, "Read", req.user._id);
  return res.send(todo);
});

//Get all todos
router.get("/", async (req, res) => {
  //We should find only todos of the incoming user
  const todos = await Todo.find({ userId: req.user._id });
  return res.send(todos);
});

module.exports = router;
