const mongoose = require('mongoose');
const {Tenant} = require('../models/tenant');

module.exports = async (req,res,next)=>{
    if(!req.params.tenantId)
        req.params.tenantId = req.body.tenantId;
    req.tenantId = req.params.tenantId;
    const validTenantId = mongoose.Types.ObjectId.isValid(req.params.tenantId);
    if(!validTenantId) return res.status(400).send('Invalid tenant id');

    const tenant = await Tenant.find({_id:req.params.tenantId});
    if(tenant.length < 1) return res.status(404).send('No tenant found with the given ID');
    next();
}