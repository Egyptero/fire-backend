const express = require("express");
const router = express.Router();
const { Transaction, validate } = require("../models/transaction");
const validateTenant = require("../middleware/validateTenant");
const verifyTenantID = require("../middleware/verifyTenantID");
const verifyTransactionID = require("../middleware/verifyTransactionID");

//Create new interaction
router.post("/", validateTenant, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const transaction = new Transaction(req.body);
  await transaction.save();
  return res.send(transaction);
});

//Update interaction
router.put(
  "/:transactionId",
  verifyTransactionID,
  verifyTenantID,
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      req.body,
      { new: true }
    );
    if (!transaction) return res.status(404).send("interaction id not found");

    return res.send(transaction);
  }
);

//Delete interaction
router.delete("/transactionId", verifyTransactionID, async (req, res) => {
  const transaction = await Transaction.findByIdAndDelete(
    req.params.transactionId
  );
  if (!transaction) return res.status(404).send("interaction id not found");
  return res.send(transaction);
});

//Get interaction by ID
router.get("/transactionId", verifyTransactionID, async (req, res) => {
  const transaction = await Transaction.findById(req.params.transactionId);
  if (!transaction)
    return res.status(404).send("interaction ID can not be found");
  return res.send(transaction);
});

//Get all interactions
router.get("/", async (req, res) => {
  const transactions = await Transaction.find();
  return res.send(transactions);
});

module.exports = router;
