const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Customer = mongoose.model(
  "customer",
  new mongoose.Schema({
    firstname: String,
    lastname: String,
    title: String,
    profession: String,
    ids: {
      facebookId: String,
      twitterId: String,
      linkedId: String,
      googleId: String,
      instagramId: String,
      smoochId: String
    },
    username: String,
    phone: String,
    email: {
      type: String
      //unique: true
    },
    emails: [
      {
        type: String
        //unique: true
      }
    ],
    phones: [
      {
        type: String
        //unique: true
      }
    ],
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    tenantIds: [
      {
        score: {
          type: Number,
          min: 0,
          max: 100,
          default: 0
        },
        tenantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tenant"
        }
      }
    ],
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
  const customerSchema = {
    firstname: joi
      .string()
      .min(3)
      .max(50),
    lastname: joi
      .string()
      .min(3)
      .max(50),
    title: joi.string().max(50),
    profession: joi.string().max(50),
    username: joi
      .string()
      .min(3)
      .max(50),
    phone: joi.string().max(20),
    email: joi.string().email(),
    emails: joi.array(),
    phones: joi.array(),
    score: joi
      .number()
      .min(0)
      .max(100),
    tenantIds: [
      {
        score: joi
          .number()
          .min(0)
          .max(100),
        tenantId: joi
          .string()
          .min(3)
          .max(120)
      }
    ],
    configuration: {
      hook: joi.string(),
      facebook: {
        token: joi.string(),
        pages: joi.array().allow(joi.string()),
        accounts: joi.array().allow(joi.string()),
        messenger: joi.boolean()
      },
      twitter: {
        pages: joi.array().allow(joi.string()),
        accounts: joi.array().allow(joi.string()),
        messenger: joi.boolean()
      }
    }
  };
  return joi.validate(data, customerSchema);
};
