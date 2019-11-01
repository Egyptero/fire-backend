const winston = require('winston');
const mongoose = require('mongoose');

module.exports = async (req,res,next)=>{
    winston.info('Verify skillgroup id as skillgroupId in the req.params');
    if(!req.params.skillgroupId)
        req.params.skillgroupId = req.body.skillgroupId;
    req.skillgroupId = req.params.skillgroupId;
    const validSkillgroupId = mongoose.Types.ObjectId.isValid(req.params.skillgroupId);
    if(!validSkillgroupId) return res.status(400).send('Invalid skillgroup id');
    next();
}