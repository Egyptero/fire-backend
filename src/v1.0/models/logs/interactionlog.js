const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Interactionlog = mongoose.model(
  "interactionlog",
  new mongoose.Schema({
    interactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interaction",
      required: true
    },
    skillgroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skillgroup"
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
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
  const interlogSchema = {
    interactionId: joi
      .string()
      .min(8)
      .max(100)
      .required(),
    skillgroupId: joi.string().allow(""),
    tenantId: joi.string().allow(""),
    customerId: joi.string().allow(""),
    action: joi.string().valid(["Create", "Update", "Delete", "Read"]),
    details: {
      by: joi.string().required(),
      data: joi.object().required()
    }
  };
  return joi.validate(data, interlogSchema);
};
