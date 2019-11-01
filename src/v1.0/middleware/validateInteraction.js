const winston = require('winston');
const mongoose = require('mongoose');
const {Interaction} = require('../models/interaction');

module.exports = async (req,res,next)=>{
    winston.info('Verify id in the req.params');
    if(!req.params.interactionId)
        req.params.interactionId = req.body.interactionId;
    req.interactionId = req.params.interactionId;
    const validInteractionId = mongoose.Types.ObjectId.isValid(req.params.interactionId);
    if(!validInteractionId) return res.status(400).send('Invalid interaction id');
    
    const interaction = await Interaction.find({_id:req.params.interactionId});
    if(interaction.length < 1) return res.status(404).send('No interaction found with the given ID');
    next();
}