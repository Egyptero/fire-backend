const express = require('express');
const router = express.Router();
const {User,validate} = require('../models/user');
const winston = require('winston');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

//Create new user
router.post('/',async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.find({username:req.body.username}).or({email:req.body.email});
    if(user.length > 0) return res.status(400).send('Username or email already exist');
    user = new User({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username:req.body.username,
        password:req.body.password,
        email:req.body.email,
        role:'User'
    });
    winston.info('Create new user');
    await user.save();
    res.send(user);
})

//Update user
router.put('/:id',auth,async(req,res)=>{
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!validId) return res.status(400).send('Invalid user id');
    
    const {error} = validate(req.body);
    if(error) res.status(400).send(error.details[0].message);
    winston.info('Update user');
    
    let user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('User id not found');

    user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.send(user);
})

//Delete user
router.delete('/:id',auth,async(req,res)=>{
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!validId) return res.status(400).send('Invalid user id');
    
    let user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('User id not found');
    await user.delete();
    res.send(user);
})

//Get user by ID
router.get('/:id',auth,async(req,res)=>{
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!validId) return res.status(400).send('Invalid user id');
    winston.info('Get user request');
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('User ID can not be found');
    res.send(user);
})

//Get all users
router.get('/',auth,async(req,res)=>{
    winston.info('Get all users request');
    const users = await User.find();
    res.send(users);
})

module.exports = router;