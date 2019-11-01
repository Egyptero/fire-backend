const winston = require('winston');
const mongoose = require('mongoose');
const {Skillgroup} = require('../models/skillgroup');

module.exports = async (req,res,next)=>{
    winston.info('Verify id in the req.params');
    if(!req.params.skillgroupId)
        req.params.skillgroupId = req.body.skillgroupId;
    req.skillgroupId = req.params.skillgroupId;
    const validSkillgroupId = mongoose.Types.ObjectId.isValid(req.params.skillgroupId);
    if(!validSkillgroupId) return res.status(400).send('Invalid skillgroup id');
    
    const skillgroup = await Skillgroup.findOne({_id:req.params.skillgroupId});
    if(!skillgroup) return res.status(404).send('No skillgroup found with the given ID');

    if(skillgroup.tenantId != req.tenantId)
        return res.status(403).send('Forbidden Access ...');
    next();
}