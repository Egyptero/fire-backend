const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Tenant = mongoose.model(
  "tenant",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      min: 5
    },
    legalName: String,
    logo: {
      type: Boolean,
      default: false
    },
    website: String,
    taxId: String,
    docs: {
      type: Boolean,
      default: false
    },
    phone: String,
    mobile: String,
    fax: String,
    email: {
      type: String,
      required: true,
      unique: true
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    adminIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    verified: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      default: "Trial",
      enum: ["Active", "Suspended", "Closed", "Trial"]
    },
    dbname: String,
    configuration: {
      hook: String,
      facebook: {
        token: String,
        pages: [String],
        accounts: [String],
        messenger: {
          type: Boolean,
          default: false
        }
      },
      twitter: {
        pages: [String],
        accounts: [String],
        messenger: {
          type: Boolean,
          default: false
        }
      }
    }
  })
);

module.exports.validate = function(data) {
  const tenantSchema = {
    name: joi
      .string()
      .min(3)
      .max(100)
      .required(),
    email: joi
      .string()
      .email()
      .required(),
    dbname: joi
      .string()
      .min(8)
      .max(100),
    adminId: joi.string().min(8),
    legalName: joi
      .string()
      .optional()
      .allow(""),
    website: joi
      .string()
      .optional()
      .allow(""),
    taxId: joi
      .string()
      .optional()
      .allow(""),
    phone: joi
      .string()
      .optional()
      .allow(""),
    mobile: joi
      .string()
      .optional()
      .allow(""),
    fax: joi
      .string()
      .optional()
      .allow("")
  };
  return joi.validate(data, tenantSchema);
};
