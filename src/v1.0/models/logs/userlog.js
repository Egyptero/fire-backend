const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Userlog = mongoose.model(
  "userlog",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      enum: [
        "Create",
        "Update",
        "Delete",
        "Read",
        "Login",
        "Logout",
        "Verify",
        "Activate",
        "RequestReset",
        "ProcessReset"
      ]
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
    userId: joi.string().required(),
    action: joi
      .string()
      .valid([
        "Create",
        "Update",
        "Delete",
        "Read",
        "Login",
        "Logout",
        "Verify",
        "Activate",
        "RequestReset",
        "ProcessReset"
      ]),
    details: {
      by: joi.string().required(),
      data: joi.object().required()
    }
  };
  return joi.validate(data, interlogSchema);
};
