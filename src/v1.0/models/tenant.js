const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Tenant = mongoose.model(
  "tenant",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      min: 5,
    },
    legalName: String,
    logo: {
      type: Boolean,
      default: false,
    },
    website: String,
    taxId: String,
    docs: {
      type: Boolean,
      default: false,
    },
    interactionCapacity: {
      type: Number,
      default: 1,
    },
    caseCapacity: {
      type: Number,
      default: 1,
    },
    offerTimeout: {
      type: Number,
      default: 8,
    },
    wrapupTimeout: {
      type: Number,
      default: 120,
    },
    dailyInteractionTarget: {
      type: Number,
      default: 30,
    },
    dailyCaseTarget: {
      type: Number,
      default: 10,
    },
    dailyUtilizationTarget: {
      type: Number,
      default: 80,
    },
    offlineASATarget: {
      type: Number,
      default: 10,
    },
    onlineASATarget: {
      type: Number,
      default: 10,
    },
    odi: {
      type: Boolean,
      default: true,
    },
    voip: {
      type: Boolean,
      default: false,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    autoAccept: {
      type: Boolean,
      default: false,
    },
    wrapup: {
      type: Boolean,
      default: true,
    },
    workbin: {
      type: Boolean,
      default: true,
    },
    autoLogin: {
      type: Boolean,
      default: false,
    },
    phone: String,
    mobile: String,
    fax: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    adminIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Trial",
      enum: ["Active", "Suspended", "Closed", "Trial"],
    }, //Not ready reason codes
    notReadyReasons: [
      {
        type: String,
      },
    ], //Logout reason codes
    logoutReasons: [
      {
        type: String,
      },
    ], //Wrap up reason codes
    wrapupReasons: [
      {
        type: String,
      },
    ],
    dbname: String,
    configuration: {
      hook: String,
      facebook: {
        token: String,
        pages: [String],
        accounts: [String],
        messenger: {
          type: Boolean,
          default: false,
        },
      },
      twitter: {
        pages: [String],
        accounts: [String],
        messenger: {
          type: Boolean,
          default: false,
        },
      },
    },
  })
);

module.exports.validate = function (data) {
  const tenantSchema = {
    name: joi.string().min(3).max(100).required(),
    email: joi.string().email().required(),
    dbname: joi.string().min(8).max(100),
    adminId: joi.string().min(8),
    adminIds: joi.array(),
    legalName: joi.string().optional().allow(""),
    website: joi.string().optional().allow(""),
    taxId: joi.string().optional().allow(""),
    phone: joi.string().optional().allow(""),
    mobile: joi.string().optional().allow(""),
    fax: joi.string().optional().allow(""),
    odi: joi.boolean(),
    voip: joi.boolean(),
    notifications: joi.boolean(),
    autoAccept: joi.boolean(),
    wrapup: joi.boolean(),
    workbin: joi.boolean(),
    autoLogin: joi.boolean(),
    interactionCapacity: joi.number(),
    caseCapacity: joi.number(),
    offerTimeout: joi.number(),
    wrapupTimeout: joi.number(),
    dailyInteractionTarget: joi.number(),
    dailyCaseTarget: joi.number(),
    dailyUtilizationTarget: joi.number(),
    offlineASATarget: joi.number(),
    onlineASATarget: joi.number(),
    notReadyReasons: joi.array(), //Not ready reasons
    logoutReasons: joi.array(),   //Logout reasons
    wrapupReasons: joi.array(),   //Wrap up reasons
  };
  return joi.validate(data, tenantSchema);
};
