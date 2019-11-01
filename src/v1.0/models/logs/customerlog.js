const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Customerlog = mongoose.model(
  "customerlog",
  new mongoose.Schema({
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
  const customerlogSchema = {
    customerId: joi.string().required(),
    action: joi.string().valid(["Create", "Update", "Delete", "Read"]),
    details: {
      by: joi.string().required(),
      data: joi.object().required()
    }
  };
  return joi.validate(data, customerlogSchema);
};
