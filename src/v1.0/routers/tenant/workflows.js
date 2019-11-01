const joi = require("joi");
const express = require("express");
const router = express.Router();
const { Workflow } = require("../../models/workflow");
const verifyWorkflowID = require("../../middleware/verifyWorkflowID");
const logWorkflowChange = require("../../functions/logger/logWorkflowChange");

//Create new workflow
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // User can create as many workflows as possible , we may need to avoid same name of workflow for the same tenant.
  workflow = new Workflow(req.body);
  workflow.tenantId = req.tenantId;

  await workflow.save();
  logWorkflowChange(workflow, "Create", req.user._id);
  return res.send(workflow);
});

//Update workflow
router.put("/:workflowId", verifyWorkflowID, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const workflow = await Workflow.findByIdAndUpdate(
    req.params.workflowId,
    req.body,
    { new: true }
  );
  if (!workflow) return res.status(404).send("workflow id not found");
  logWorkflowChange(workflow, "Update", req.user._id);
  return res.send(workflow);
});

//Delete workflow , We should't delete the workflow , we should remove only the tenant id
router.delete("/:workflowId", verifyWorkflowID, async (req, res) => {
  let workflow = await Workflow.findByIdAndDelete(req.params.workflowId);
  if (!workflow) return res.status(404).send("workflow id not found");
  logWorkflowChange(workflow, "Delete", req.user._id);
  return res.send(workflow);
});

//Get workflow by ID
router.get("/:workflowId", verifyWorkflowID, async (req, res) => {
  const workflow = await Workflow.findById(req.params.workflowId);
  if (!workflow) return res.status(404).send("workflow ID can not be found");
  logWorkflowChange(workflow, "Read", req.user._id);
  return res.send(workflow);
});

//Get all workflows
router.get("/", async (req, res) => {
  //We should find only workflows of the incoming tenant
  //TODO , We have a bug here
  const workflows = await Workflow.find({ tenantId: req.tenantId });
  return res.send(workflows);
});

function validate(data) {
  const workflowSchema = {
    name: joi.string().required(),
    data: joi.array(),
    type: joi.string().valid(["ROUTE", "BOT", "IVR"]),
    tenantId: joi.string()
  };
  return joi.validate(data, workflowSchema);
}

module.exports = router;
