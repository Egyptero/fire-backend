const joi = require("joi");
const express = require("express");
const router = express.Router();
const { Transaction } = require("../../models/transaction");
const verifyCustomerID = require("../../middleware/verifyCustomerID");
const verifyTransactionID = require("../../middleware/verifyTransactionID");
const validateCustomer = require("../../middleware/validateCustomer");
//Create new transaction
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let transaction = new Transaction(req.body);
  transaction.tenantId = req.tenantId;
  transaction.lastModifiedDate = Date.now();
  await transaction.save();
  return res.send(transaction);
});

//Update transaction
router.put("/:transactionId", verifyTransactionID, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  req.body.tenantId = req.tenantId;
  req.body.lastModifiedDate = Date.now();
  const transaction = await Transaction.findByIdAndUpdate(
    req.params.transactionId,
    req.body,
    { new: true }
  );
  if (!transaction) return res.status(404).send("transaction id not found");
  return res.send(transaction);
});

//Delete transaction
router.delete("/:transactionId", verifyTransactionID, async (req, res) => {
  const transaction = await Transaction.findByIdAndDelete(
    req.params.transactionId
  );
  if (!transaction) return res.status(404).send("transaction id not found");
  return res.send(transaction);
});

//Get transaction by ID
router.get("/:transactionId", verifyTransactionID, async (req, res) => {
  const transaction = await Transaction.findById(req.params.transactionId);
  if (!transaction)
    return res.status(404).send("transaction ID can not be found");
  return res.send(transaction);
});

//Get all transaction
router.get("/", async (req, res) => {
  const transactions = await Transaction.find({ tenantId: req.tenantId });
  return res.send(transactions);
});

function validate(data) {
  const transactionSchema = {
    name: joi
      .string()
      .min(3)
      .max(100)
      .required(),
    description: joi
      .string()
      .min(3)
      .max(2048)
  };
  return joi.validate(data, transactionSchema);
}

module.exports = router;
