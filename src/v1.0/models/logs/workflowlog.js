const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Workflowlog = mongoose.model(
  "workflowlog",
  new mongoose.Schema({
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
      required: true
    },
    action: {
      type: String,
      enum: ["Create", "Update", "Delete", "Read"]
    },
    details: {
      date: {
        type: Date,
        default: Date.now()
      },
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      data: Object
    }
  })
);

module.exports.validate = function(data) {
  const workflowlogSchema = {
    workflowId: joi.string().required(),
    action: joi.string().valid(["Create", "Update", "Delete", "Read"]),
    details: {
      by: joi.string().required(),
      data: joi.object().required()
    }
  };
  return joi.validate(data, workflowlogSchema);
};
