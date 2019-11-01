const winston = require('winston');
const mongoose = require('mongoose');

module.exports = async (req,res,next)=>{
    winston.info('Verify user id as userId in the req.params');
    if(!req.params.userId)
        req.params.userId = req.body.userId;
    req.userId = req.params.userId;
    const validUserId = mongoose.Types.ObjectId.isValid(req.params.userId);
    if(!validUserId) return res.status(400).send('Invalid user id');
    next();
}