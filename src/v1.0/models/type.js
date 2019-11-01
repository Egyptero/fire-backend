const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Type = mongoose.model(
  "type",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 5
    },
    channel: {
      type: String,
      required: true,
      enum: [
        "Facebook Page",
        "Facebook DM",
        "Twitter Account",
        "Twitter DM",
        "Instagram Account",
        "Instagram DM",
        "WhatsApp Business",
        "LinkedIn",
        "Youtube",
        "Voice",
        "Vedio",
        "SMS",
        "Chat",
        "Email",
        "Webrtc",
        "Project",
        "Custom"
      ],
      default: "Custom"
    },
    description: String,
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow"
    }
  })
);

module.exports.validate = function(data) {
  const typeSchema = {
    name: joi
      .string()
      .min(3)
      .max(20)
      .required(),
    description: joi.string().max(2048),
    channel: joi
      .string()
      .valid([
        "Facebook Page",
        "Facebook DM",
        "Twitter Account",
        "Twitter DM",
        "Instagram Account",
        "Instagram DM",
        "WhatsApp Business",
        "LinkedIn",
        "Youtube",
        "Voice",
        "Vedio",
        "SMS",
        "Chat",
        "Email",
        "Webrtc",
        "Project",
        "Custom"
      ])
      .required(),
    tenantId: joi.string().required(),
    workflowId: joi.string()
  };
  return joi.validate(data, typeSchema);
};
