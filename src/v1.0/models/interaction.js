const mongoose = require("mongoose");
const joi = require("joi");

module.exports.Interaction = mongoose.model(
  "interaction",
  new mongoose.Schema({
    fromAddress: String,
    toAddress: String,
    crmlink: String,
    ani: String,
    dnis: String,
    dialNumber: String,
    nodeId: String,
    workflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workflow",
    },
    skillgroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skillgroup",
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    attached: Object,
    data: Object,
    conversationData: [
      {
        message: String,
        timestamp: {
          type: Date,
          default: Date.now(),
        },
        from: {
          id: mongoose.Schema.Types.ObjectId,
          type: {
            type: String,
            enum: ["User", "Customer"],
          },
          name: String,
        },
        to: {
          id: mongoose.Schema.Types.ObjectId,
          type: {
            type: String,
            enum: ["User", "Customer"],
          },
          name: String,
        },
        delivered: Boolean,
        seen: Boolean,
      },
    ],
    subType: {
      type: String,
      enum: [
        "Comment",
        "Post",
        "Media",
        "Review",
        "DM",
        "Tweet",
        "Mention",
        "Hashtag",
        "Voice",
        "Video",
        "Webrtc",
      ],
    },
    direction: {
      type: String,
      enum: ["Inbound", "Outbound"],
      default: "Inbound",
    },
    creationDate: {
      type: Date,
      default: Date.now,
    },
    lastModifiedDate: {
      type: Date,
      default: Date.now,
    },
    stage: {
      type: String,
      default: "New",
      enum: [
        "New",
        "Verify",
        "Routing",
        "Reserved",
        "Queue",
        "Offer",
        "Handle",
        "Hold",
        "Error",
        "Close",
        "Terminate",
        "Accept",
        "Reject",
      ],
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Type",
    },
    schedule: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  })
);

module.exports.validate = function (data) {
  const interactionSchema = {
    fromAddress: joi.string().min(3).max(100),
    toAddress: joi.string().min(3).max(100),
    ani: joi.string().min(3).max(20),
    dnis: joi.string().min(3).max(20),
    dialNumber: joi.string().min(3).max(20),
    skillgroupId: joi.string(),
    tenantId: joi.string(),
    agentId: joi.string().min(3).max(100),
    transactionId: joi.string().min(3).max(100),
    attached: joi.object(),
    data: joi.object(),
    conversationData: joi.array(),
    creationDate: joi.date(),
    lastModifiedDate: joi.date(),
    schedule: joi.date(),
    createdBy: joi.string().min(3),
    modifiedBy: joi.string().min(3),
    stage: joi
      .string()
      .min(3)
      .valid([
        "New",
        "Verify",
        "Routing",
        "Reserved",
        "Queue",
        "Offer",
        "Handle",
        "Hold",
        "Error",
        "Close",
        "Terminate",
        "Accept",
        "Reject",
      ]),
    typeId: joi.string().min(3).max(100),
    subType: joi
      .string()
      .valid([
        "Comment",
        "Review",
        "Post",
        "Media",
        "Review",
        "DM",
        "Tweet",
        "Mention",
        "Hashtag",
        "Voice",
        "Video",
        "Webrtc",
      ]),
    direction: joi.string().valid(["Inbound", "Outbound"]),
  };
  return joi.validate(data, interactionSchema);
};
