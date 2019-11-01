const winston = require('winston');
const mongoose = require('mongoose');
const {Transaction} = require('../models/transaction');

module.exports = async (req,res,next)=>{
    if(!req.params.transactionId)
        req.params.transactionId = req.body.transactionId;
    req.transactionId = req.params.transactionId;
    const validTransactionId = mongoose.Types.ObjectId.isValid(req.params.transactionId);
    if(!validTransactionId) return res.status(400).send('Invalid transaction id');
    
    const interaction = await Transaction.find({_id:req.params.transactionId});
    if(interaction.length < 1) return res.status(404).send('No transaction found with the given ID');
    next();
}