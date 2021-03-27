const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");

let userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  username: {
    type: String,
    required: true,
    unique: true,
    min: 5
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  otherEmails: [
    {
      type: String
      //unique: true
    }
  ],
  skillIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skillgroup"
    }
  ],
  tenantIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant"
    }
  ],
  status: {
    type: mongoose.Schema.Types.String,
    enum: [
      "Unknown",
      "Connected",
      "Logged In",
      "Ready",
      "Not ready",
      "Wrap up",
      "Reserved",
      "Handling",
      "Error",
      "Logged Out"
    ],
    default: "Unknown"
  },
  nextStatus: {
    type: mongoose.Schema.Types.String,
    enum: [
      "Unknown",
      "Connected",
      "Logged In",
      "Ready",
      "Not ready",
      "Wrap up",
      "Reserved",
      "Handling",
      "Error",
      "Logged Out"
    ]
  },
  inStateTime: {
    type: Date,
    default: Date.now()
  },
  odi: {
    type: Boolean,
    default: false
  },
  phone: {
    type: Boolean,
    default: false
  },
  sipServer: String,
  sipUserName: String,
  sipPassword: String,
  sipUri: String,
  sipStatus: {
    type: String,
    enum: ["Unknown", "Connected", "Disconnected"]
  },
  sharedAgent: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: [
      "User",
      "Agent",
      "Supervisor",
      "Leader",
      "Business",
      "Administrator",
      "SysAdmin"
    ],
    default: "User"
  },
  lastModifiedDate: {
    type: Date,
    default: Date.now()
  },
  creationDate: {
    type: Date,
    default: Date.now()
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mode: {
    type: String,
    enum: ["Push", "Pull", "Mixed"],
    default: "Push"
  },
  interactionIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interaction"
    }
  ],
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  accountStatus: {
    type: String,
    enum: ["Pending", "Active", "Inactive", "Archived", "Suspended"],
    default: "Pending"
  },
  accountType: {
    type: String,
    enum: ["Free", "Class A", "Class B", "Class C"],
    default: "Free"
  },
  receiveUpdates: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    enum: ["User", "Company"]
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      otherEmails: this.otherEmails,
      role: this.role,
      tenantIds: this.tenantIds,
      skillIds: this.skillIds,
      interactionIds: this.interactionIds,
      mode: this.mode,
      status: this.status,
      nextStatus: this.nextStatus,
      managerId: this.managerId,
      inStateTime: this.inStateTime,
      odi: this.odi,
      phone: this.phone,
      sipUri: this.sipUri,
      sipServer: this.sipServer,
      sipUserName: this.sipUserName,
      sipPassword: this.sipPassword,
      sipStatus: this.sipStatus,
      type: this.type,
      accountStatus: this.accountStatus,
      accountType: this.accountType
    },
    config.get("jwtPrivateKey")
  );
  return token;
};
userSchema.methods.hashPassword = async function() {
  if (!this.password) return;
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(this.password, salt);
  this.password = hashed;
};
module.exports.User = mongoose.model("user", userSchema);

module.exports.validate = function(data) {
  const schema = {
    firstname: joi
      .string()
      .min(3)
      .max(20),
    lastname: joi
      .string()
      .min(3)
      .max(20),
    username: joi
      .string()
      .min(5)
      .required(),
    password: joi
      .string()
      .min(8)
      .max(200)
      .required(),
    email: joi
      .string()
      .email()
      .required(),
    sharedAgent: joi.boolean(),
    otherEmails: joi.array().valid(joi.string().email()),
    modifiedBy: joi.string().min(3),
    lastModifiedDate: joi.date(),
    creationDate: joi.date(),
    mode: joi.string().valid(["Push", "Pull", "Mix"]),
    managerId: joi.string().allow(""),
    inStateTime: joi.date(),
    odi: joi.boolean(),
    phone: joi.boolean(),
    sipUri: joi.string(),
    sipServer: joi.string(),
    sipUserName: joi.string(),
    sipPassword: joi.string(),
    sipStatus: joi.string().valid(["Unknown", "Connected", "Disconnected"]),
    receiveUpdates: joi.boolean(),
    type: joi
      .string()
      .valid(["User", "Company"])
      .optional()
  };
  return joi.validate(data, schema);
};
