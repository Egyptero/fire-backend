const winston = require("winston");
const mongoose = require("mongoose");

module.exports = async (req, res, next) => {
  winston.info("Verify workflow id as workflowId in the req.params");
  if (!req.params.workflowId) req.params.workflowId = req.body.workflowId;
  req.workflowId = req.params.workflowId;
  const validWorkflowId = mongoose.Types.ObjectId.isValid(
    req.params.workflowId
  );
  if (!validWorkflowId) return res.status(400).send("Invalid workflow id");
  next();
};
