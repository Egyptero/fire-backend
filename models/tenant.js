const mongoose = require('mongoose');
const joi = require('joi');

module.exports.Tenant = mongoose.model('tenant',new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:5
    },
    email:{
        type:String,
        required:true
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
}));

module.exports.validate = function(data){
    const tenantSchema = {
        name:joi.string().min(3).max(20).required(),
        email:joi.string().email().required()
    };
    return joi.validate(data,tenantSchema);
}

 