const { Type } = require("../../models/type");
const { Workflow } = require("../../models/workflow");
const winston = require("winston");
const executeWorkflow = require("./workflow/executeWorkflow");
const logInteractionChange = require("../logger/logInteractionChange");
const validateInteraction = interaction => {
  if (!interaction) {
    winston.error(
      "New interaction route request , however interaction is null"
    );
    return false;
  }
  if (!interaction.typeId) {
    winston.error(
      "New interaction route request , however interaction is typeId is not defined. Process will break"
    );
    return false;
  }
  return true;
};
const validateType = (type, typeId) => {
  if (!type) {
    winston.error(
      `Interactio typeId:${typeId} can not be found , process with break`
    );
    return false;
  }
  if (!type.workflowId) {
    winston.error(
      `Interactio type:${
        type.name
      } is not associated with workflow , please link it to workflow. Process will break.`
    );
    return false;
  }
  return true;
};
const validateWorkflow = (workflow, workflowId) => {
  if (!workflow) {
    window.error(
      `Workflow with id:${workflowId} cannot be found , seems it was deleted , we have to break`
    );
    return false;
  }
  if (!workflow.data) {
    window.error(
      `Workflow with id:${workflowId} has not flow defined , please go to editor , and build workflow, process will break`
    );
    return false;
  }
  return true;
};
module.exports = async (interaction, requester) => {
  //TODO , We need to check the interactions in Queue for that
  // Agent and select the most appropraite interaction for that Agent.
  //Rules of Selection
  //1- Interactions of tenant assigned to the User
  //2- Longest Queue Interaction
  //3- We should look at capacity rules
  //4- We should look at Priority rule

  /** interaction , type , workflow */
  interaction.stage = "Verify";
  await interaction.save();

  if (!validateInteraction(interaction)) {
    interaction.stage = "Error";
    await interaction.save();
    logInteractionChange(interaction, "Update", requester);
    return;
  }
  winston.info(`New interaction received with Id:${interaction._id}`);
  let type = await Type.findById(interaction.typeId);
  if (!validateType(type, interaction.typeId)) {
    interaction.stage = "Error";
    await interaction.save();
    logInteractionChange(interaction, "Update", requester);
    return;
  }
  let workflow = await Workflow.findById(type.workflowId);
  if (!validateWorkflow(workflow, type.workflowId)) {
    interaction.stage = "Error";
    await interaction.save();
    logInteractionChange(interaction, "Update", requester);
    return;
  }
  winston.info(`Interaction workflow:${workflow.name} and data is found`);
  executeWorkflow(interaction, workflow, requester);
  // now let us execute workflow.
};
