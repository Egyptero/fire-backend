const winston = require('winston');
const mongoose = require('mongoose');

module.exports = async (req,res,next)=>{
    winston.info('Verify interaction id as interactionId in the req.params');
    if(!req.params.interactionId)
        req.params.interactionId = req.body.interactionId;
    req.interactionId = req.params.interactionId;        
    const validInteractionId = mongoose.Types.ObjectId.isValid(req.params.interactionId);
    if(!validInteractionId) return res.status(400).send('Invalid interaction id');
    next();
}