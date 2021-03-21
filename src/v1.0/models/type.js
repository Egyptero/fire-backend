const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Type = mongoose.model(
  "type",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 5,
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
        "Custom",
      ],
      default: "Custom",
    },
    description: String,
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
    },
    sla: {
      type: Number,
      required: false,
    }, // SLA in seconds
    oona: {
      type: Number,
      required: false,
    }, // Offer on no accept
  })
);

module.exports.validate = function (data) {
  const typeSchema = {
    name: joi.string().min(3).max(20).required(),
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
        "Custom",
      ])
      .required(),
    tenantId: joi.string().required(),
    workflowId: joi.string(),
    sla: joi.number().min(3).max(999), //Max SLA is 999 and min 3 seconds
    oona: joi.number().min(3).max(9999), // Max OONA (Offer on no answer) min is 3 and max is 9999 seconds
  };
  return joi.validate(data, typeSchema);
};
