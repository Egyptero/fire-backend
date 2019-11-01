const joi = require("joi");
module.exports.validateInput = input => {
  const schema = {
    action: joi
      .string()
      .min(3)
      .max(100)
      .required(),
    interactionId: joi
      .string()
      .min(3)
      .max(100)
      .optional(),
    status: joi
      .string()
      .valid([
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
      ]),
    date: joi.date().required(),
    reason: joi
      .string()
      .min(3)
      .max(100)
      .optional(),
    token: joi
      .string()
      .min(10)
      .required()
  };
  return joi.validate(input, schema);
};

module.exports.validateOutput = input => {
  const schema = {
    token: joi.string().optional(),
    user: joi.object().optional(),
    interactionDetails: {
      interaction: joi.object().required(),
      buttons: joi.object().required()
    },
    interactionIds: joi.array().optional(),
    status: joi
      .string()
      .valid([
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
      ])
      .optional(),
    nextStatus: joi
      .string()
      .valid([
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
      ])
      .optional(),
    message: joi.string().required(),
    action: joi
      .string()
      .min(3)
      .max(100)
      .required(), // Could be aknowledge or it could be update or it could be new
    buttons: joi.object().optional()
  };
  return joi.validate(input, schema);
};
