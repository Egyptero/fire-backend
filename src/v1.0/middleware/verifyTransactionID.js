const winston = require('winston');
const mongoose = require('mongoose');

module.exports = async (req,res,next)=>{
    if(!req.params.transactionId)
        req.params.transactionId = req.body.transactionId;
    req.transactionId = req.params.transactionId;        
    const validTransactionId = mongoose.Types.ObjectId.isValid(req.params.transactionId);
    if(!validTransactionId) return res.status(400).send('Invalid transaction id');
    next();
}