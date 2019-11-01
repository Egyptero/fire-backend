const winston = require('winston');
const mongoose = require('mongoose');
const {User} = require('../models/user');

module.exports = async (req,res,next)=>{
    winston.info('Verify user id as userId in the req.params');
    if(!req.params.userId)
        req.params.userId = req.body.userId;
    req.userId = req.params.userId;
    const validUserId = mongoose.Types.ObjectId.isValid(req.params.userId);
    if(!validUserId) return res.status(400).send('Invalid user id');
    
    const user = await User.find({_id:req.params.userId});
    if(user.length < 1) return res.status(404).send('No user found with the given ID');
    next();
}