const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Todolog = mongoose.model(
  "todolog",
  new mongoose.Schema({
    todoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
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
    todoId: joi.string().required(),
    action: joi.string().valid(["Create", "Update", "Delete", "Read"]),
    details: {
      by: joi.string().required(),
      data: joi.object().required()
    }
  };
  return joi.validate(data, workflowlogSchema);
};
