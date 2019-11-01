const mongoose = require('mongoose');

module.exports = async (req,res,next)=>{
    if(!req.params.tenantId)
        req.params.tenantId = req.body.tenantId;
    req.tenantId = req.params.tenantId;
    const validTenantId = mongoose.Types.ObjectId.isValid(req.params.tenantId);
    if(!validTenantId) return res.status(400).send('Invalid tenant id');
    next();
}