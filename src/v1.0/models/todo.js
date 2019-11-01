const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Todo = mongoose.model(
  "todo",
  new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    due: {
      type: Date,
      required: true,
      default: Date.now() + 1
    },
    priority: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      required: true,
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["New", "Progress", "Completed"],
      required: true,
      default: "New"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  })
);

module.exports.validate = data => {
  const schema = {
    title: joi
      .string()
      .min(1)
      .max(512)
      .required(),
    description: joi
      .string()
      .max(2048)
      .allow(""),
    due: joi.date().required(),
    priority: joi.string().valid(["Critical", "High", "Medium", "Low"]),
    status: joi.string().valid(["New", "Progress", "Completed"]),
    userId: joi.string()
  };
  return joi.validate(data, schema);
};

module.exports.validateUpdate = data => {
  const schema = {
    title: joi
      .string()
      .min(1)
      .max(512),
    description: joi
      .string()
      .max(2048)
      .allow(""),
    due: joi.date(),
    priority: joi.string().valid(["Critical", "High", "Medium", "Low"]),
    status: joi.string().valid(["New", "Progress", "Completed"]),
    userId: joi.string()
  };
  return joi.validate(data, schema);
};
