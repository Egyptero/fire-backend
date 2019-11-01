const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Workflow = mongoose.model(
  "workflow",
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    data: [],
    type: {
      type: String,
      enum: ["ROUTE", "BOT", "IVR"],
      required: true
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant"
    }
  })
);

module.exports.validate = data => {
  const schema = {
    name: joi.string().required(),
    data: joi.array(),
    type: joi.string().valid(["ROUTE", "BOT", "IVR"]),
    tenantId: joi.string()
  };
  return joi.validate(data, schema);
};
