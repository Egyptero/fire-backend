const express = require('express');
const router = express.Router();
const {Skillgroup,validate} = require('../models/skillgroup');
const winston = require('winston');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const verifyTenant = require('../middleware/verifyTenent');
//Create new skill
router.post('/:tenantId/skillgroups',verifyTenant,async(req,res)=>{
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let skillgroup = await Skillgroup.find({name:req.body.name})
    .and({tenantId: req.params.tenantId});
    if(skillgroup.length > 0) return res.status(400).send('Same skillname already exist');
    skillgroup = new Skillgroup({
        name:req.body.name,
        tenantId:req.params.tenantId,
        description:req.body.description
    });
    winston.info('Create new skillgroup');
    await skillgroup.save();
    res.send(skillgroup);
})

//Update skill
router.put('/:tenantId/skillgroups/:id',auth,verifyTenant,async(req,res)=>{
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!validId) return res.status(400).send('Invalid skillgroup id');
    
    const {error} = validate(req.body);
    if(error) res.status(400).send(error.details[0].message);
    winston.info('Update skillgroup');
    
    let skillgroup = await Skillgroup.findById(req.params.id);
    if(!skillgroup) return res.status(404).send('Skillgroup id not found');

    skillgroup = await Skillgroup.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.send(skillgroup);
})

//Delete skill
router.delete('/:tenantId/skillgroups/:id',auth,verifyTenant,async(req,res)=>{
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!validId) return res.status(400).send('Invalid skillgroup id');
    
    let skillgroup = await Skillgroup.findById(req.params.id);
    if(!skillgroup) return res.status(404).send('Skillgroup id not found');
    await skillgroup.delete();
    res.send(skillgroup);
})

//Get skill by ID
router.get('/:tenantId/skillgroups/:id',auth,verifyTenant,async(req,res)=>{
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!validId) return res.status(400).send('Invalid skillgroup id');
    winston.info('Get skillgroup request');
    const skillgroup = await Skillgroup.findById(req.params.id);
    if(!skillgroup) return res.status(404).send('Skillgroup ID can not be found');
    res.send(skillgroup);
})

//Get all skills
router.get('/:tenantId/skillgroups/',auth,verifyTenant,async(req,res)=>{
    winston.info('Get all skills request');
    const skillgroups = await Skillgroup.find({tenantId:req.params.tenantId});
    res.send(skillgroups);
})

module.exports = router;