const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Node = mongoose.model(
  "node",
  new mongoose.Schema({
    nodeName: {
      type: String,
      required: true,
      min: 5
    },
    workflowName: {
      type: String,
      required: true,
      min: 5
    },
    nodeId: String,
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "workflow"
    },
    interactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "interaction"
    },
    dateIn: {
      type: Date,
      default: Date.now()
    },
    dateOut: Date,
    state: {
      type: String,
      enum: ["Yes", "No", "Error", "In"]
    }
  })
);

module.exports.validate = function(data) {
  const nodeSchema = {
    nodeName: joi.string().required(),
    workflowName: joi.string().required(),
    nodeId: joi.string(),
    workflowId: joi.string(),
    interactionId: joi.string(),
    dateIn: joi.date(),
    dateOut: joi.date(),
    state: joi.string().valid(["Yes", "No", "Error", "In"])
  };
  return joi.validate(data, nodeSchema);
};
