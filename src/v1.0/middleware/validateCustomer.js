const winston = require('winston');
const mongoose = require('mongoose');
const {Customer} = require('../models/customer');

module.exports = async (req,res,next)=>{
    winston.info('Verify customer id as customerId in the req.params');
    if(!req.params.customerId)
        req.params.customerId = req.body.customerId;
    req.customerId = req.params.customerId;    
    const validCustomerId = mongoose.Types.ObjectId.isValid(req.params.customerId);
    if(!validCustomerId) return res.status(400).send('Invalid customer id');
    
    const customer = await Customer.find({_id:req.params.customerId});
    if(customer.length < 1) return res.status(404).send('No customer found with the given ID');
    next();
}