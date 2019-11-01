const winston = require('winston');
const mongoose = require('mongoose');

module.exports = async (req,res,next)=>{
    winston.info('Verify customer id as customerId in the req.params');
    if(!req.params.customerId)
        req.params.customerId = req.body.customerId;
    req.customerId = req.params.customerId;
    const validCustomerId = mongoose.Types.ObjectId.isValid(req.params.customerId);
    if(!validCustomerId) return res.status(400).send('Invalid customer id');    
    next();
}