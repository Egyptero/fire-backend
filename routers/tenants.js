const express = require('express');
const router = express.Router();
const {Tenant,validate} = require('../models/tenant');
const winston = require('winston');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

//Create new tenant
router.post('/',async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    let tenant = await Tenant.find({email:req.body.email});
    if(tenant.length > 0) return res.status(400).send('Email already exist');
    tenant = new Tenant({
        name:req.body.name,
        email:req.body.email
    });
    winston.info('Create new tenant');
    await tenant.save();
    res.send(tenant);
})

//Update tenant
router.put('/:id',auth,async(req,res)=>{
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!validId) return res.status(400).send('Invalid tenant id');
    
    const {error} = validate(req.body);
    if(error) res.status(400).send(error.details[0].message);
    winston.info('Update Tenant');
    
    let tenant = await Tenant.findById(req.params.id);
    if(!tenant) return res.status(404).send('Tenant id not found');

    tenant = await Tenant.findByIdAndUpdate(req.params.id,req.body);
    res.send(tenant);
})

//Delete tenant
router.delete('/:id',auth,async(req,res)=>{
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!validId) return res.status(400).send('Invalid tenant id');
    
    let tenant = await Tenant.findById(req.params.id);
    if(!tenant) return res.status(404).send('Tenant id not found');
    winston.info('Delete Tenant request');
    await tenant.delete();
    res.send(tenant);
})

//Get Tenant by ID
router.get('/:id',auth,async(req,res)=>{
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!validId) return res.status(400).send('Invalid tenant id');
    winston.info('Get Tenant request');
    const tenant = await Tenant.findById(req.params.id);
    if(!tenant) return res.status(404).send('Tenant ID can not be found');
    res.send(tenant);
})

//Get all users
router.get('/',auth,async(req,res)=>{
    winston.info('Get all tenants request');
    const tenants = await Tenant.find();
    res.send(tenants);
})

module.exports = router;