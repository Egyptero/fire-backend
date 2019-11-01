const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Feedback = mongoose.model(
  "feedback",
  new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    module: {
      type: String,
      enum: [
        "Types",
        "Workflows",
        "Skillgroups configuration",
        "Users configuration",
        "Dashboard",
        "Queues",
        "History",
        "Organization Wizard",
        "Welcome",
        "Others"
      ],
      default: "Others"
    },
    description: String,
    type: {
      type: String,
      enum: [
        "Feedback",
        "Question",
        "Request",
        "Recommendation",
        "Requirements",
        "Defect"
      ],
      default: "Feedback"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    reply: String,
    status: {
      type: String,
      enum: ["Open", "Close", "Cancel", "Hold"],
      default: "Open"
    }
  })
);

module.exports.validate = function(data) {
  const schema = {
    title: joi
      .string()
      .required()
      .min(5),
    module: joi
      .string()
      .valid([
        "Types",
        "Workflows",
        "Skillgroups configuration",
        "Users configuration",
        "Dashboard",
        "Queues",
        "History",
        "Organization Wizard",
        "Welcome",
        "Others"
      ])
      .optional(),
    description: joi.string().allow(["", null]),
    type: joi
      .string()
      .valid([
        "Feedback",
        "Question",
        "Request",
        "Recommendation",
        "Requirements",
        "Defect"
      ])
      .optional()
      .max(512),

    userId: joi
      .string()
      .min(3)
      .max(120),
    reply: joi.string().max(2048)
  };
  return joi.validate(data, schema);
};

module.exports.validateUpdate = function(data) {
  const schema = {
    title: joi.string().optional(),
    module: joi
      .string()
      .valid([
        "Types",
        "Workflows",
        "Skillgroups configuration",
        "Users configuration",
        "Dashboard",
        "Queues",
        "History",
        "Organization Wizard",
        "Welcome",
        "Others"
      ])
      .optional(),
    description: joi.string().allow(["", null]),
    type: joi
      .string()
      .valid([
        "Feedback",
        "Question",
        "Request",
        "Recommendation",
        "Requirements",
        "Defect"
      ])
      .optional()
      .max(512),

    userId: joi
      .string()
      .min(3)
      .max(120),
    reply: joi.string().max(2048)
  };
  return joi.validate(data, schema);
};
