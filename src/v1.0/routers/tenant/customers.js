const joi = require("joi");
const express = require("express");
const router = express.Router();
const { Customer } = require("../../models/customer");
const verifyCustomerID = require("../../middleware/verifyCustomerID");
const logCustomerChange = require("../../functions/logger/logCustomerChange");

//Create new customer
router.post("/", async (req, res) => {
  //TODO , We need to check if the customer exist , then update the list of tenant by the new tenant ID
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = await Customer.find({ username: req.body.username }).or({
    email: req.body.email
  });
  if (customer.length > 0)
    return res.status(400).send("Username already exist");
  customer = new Customer(req.body);
  customer.tenantIds.push({ score: 0, tenantId: req.tenantId });

  await customer.save();
  logCustomerChange(customer, "Create", req.user._id);
  return res.send(customer);
});

//Update customer
router.put("/:customerId", verifyCustomerID, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findByIdAndUpdate(
    req.params.customerId,
    req.body,
    { new: true }
  );
  if (!customer) return res.status(404).send("Customer id not found");
  logCustomerChange(customer, "Update", req.user._id);
  return res.send(customer);
});

//Delete customer , We should't delete the customer , we should remove only the tenant id
router.delete("/:customerId", verifyCustomerID, async (req, res) => {
  let customer = await Customer.findByIdAndDelete(req.params.customerId);
  if (!customer) return res.status(404).send("Customer id not found");
  logCustomerChange(customer, "Delete", req.user._id);
  return res.send(customer);
});

//Get customer by ID
router.get("/:customerId", verifyCustomerID, async (req, res) => {
  const customer = await Customer.findById(req.params.customerId);
  if (!customer) return res.status(404).send("Customer ID can not be found");
  logCustomerChange(customer, "Read", req.user._id);
  return res.send(customer);
});

//Get all customers
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  return res.send(customers);
});

function validate(data) {
  const customerSchema = {
    firstname: joi
      .string()
      .max(50)
      .allow("", null),
    lastname: joi
      .string()
      .max(50)
      .allow("", null),
    title: joi
      .string()
      .max(50)
      .allow("", null),
    profession: joi
      .string()
      .max(50)
      .allow("", null),
    phone: joi
      .string()
      .max(20)
      .allow("", null),
    email: joi.string().email(),
    ids: {
      facebookId: joi
        .string()
        .optional()
        .allow("", null),
      twitterId: joi
        .string()
        .optional()
        .allow("", null),
      linkedId: joi
        .string()
        .optional()
        .allow("", null),
      googleId: joi
        .string()
        .optional()
        .allow("", null),
      instagramId: joi
        .string()
        .optional()
        .allow("", null),
      smoochId: joi
        .string()
        .optional()
        .allow("", null)
    },
    username: joi
      .string()
      .max(50)
      .required(),
    emails: joi.array(),
    phones: joi.array(),
    score: joi
      .number()
      .min(0)
      .max(100)
  };
  return joi.validate(data, customerSchema);
}

module.exports = router;
