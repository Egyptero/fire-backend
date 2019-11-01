const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");
const winston = require("winston");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const shouldBeSysAdmin = require("../middleware/auth/shouldBeSysAdmin");
const verifyCustomerID = require("../middleware/verifyCustomerID");
const logCustomerChange = require("../functions/logger/logCustomerChange");

//Create new customer
router.post("/", auth, shouldBeSysAdmin, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = await Customer.find({ customername: req.body.username });
  if (customer.length > 0)
    return res.status(400).send("Username already exist");
  customer = new Customer(req.body);
  await customer.save();
  await logCustomerChange(customer, "Create", req.user);

  winston.info(`New customer created: ${customer.toString()}`);
  return res.send(customer);
});

//Update customer
router.put(
  "/:customerId",
  auth,
  shouldBeSysAdmin,
  verifyCustomerID,
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findByIdAndUpdate(
      req.params.customerId,
      req.body,
      { new: true }
    );
    if (!customer) return res.status(404).send("Customer id not found");
    winston.info(
      `Customer with id ${
        req.params.customerId
      } updated as the following: ${customer.toString()}`
    );
    await logCustomerChange(customer, "Update", req.user);
    return res.send(customer);
  }
);

//Delete customer
router.delete(
  "/:customerId",
  auth,
  shouldBeSysAdmin,
  verifyCustomerID,
  async (req, res) => {
    let customer = await Customer.findById(req.params.customerId);
    if (!customer) return res.status(404).send("Customer id not found");
    await customer.delete();
    winston.info(
      `Customer with id ${
        req.params.customerId
      } deleted: ${customer.toString()}`
    );
    await logCustomerChange(customer, "Delete", req.user);
    return res.send(customer);
  }
);

//Get customer by ID
router.get(
  "/:customerId",
  auth,
  shouldBeSysAdmin,
  verifyCustomerID,
  async (req, res) => {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) return res.status(404).send("Customer ID can not be found");
    await logCustomerChange(customer, "Read", req.user);
    return res.send(customer);
  }
);

//Get all customers
router.get("/", auth, shouldBeSysAdmin, async (req, res) => {
  const customers = await Customer.find();
  return res.send(customers);
});

module.exports = router;
