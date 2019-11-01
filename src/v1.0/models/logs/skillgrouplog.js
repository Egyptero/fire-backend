const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Skillgrouplog = mongoose.model(
  "skillgrouplog",
  new mongoose.Schema({
    skillgroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skillgroup",
      required: true
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
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
    skillgroupId: joi.string().required(),
    tenantId: joi.string().required(),
    action: joi.string().valid(["Create", "Update", "Delete", "Read"]),
    details: {
      by: joi.string().required(),
      data: joi.object().required()
    }
  };
  return joi.validate(data, interlogSchema);
};
