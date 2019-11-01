const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Skillgroup = mongoose.model(
  "skillgroup",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 5
    },
    description: String,
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true
    }
  })
);

module.exports.validate = function(data) {
  const skillgroupSchema = {
    name: joi
      .string()
      .min(3)
      .max(20)
      .required(),
    description: joi.string(),
    tenantId: joi.string().required()
  };
  return joi.validate(data, skillgroupSchema);
};
