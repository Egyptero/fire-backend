const mongoose = require('mongoose');
const joi = require('joi');

module.exports.Transaction = mongoose.model('transaction',new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    description:String,
    tenantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tenant',
        required:true
    },
    attached:Object,
    createDate:{
        type:Date,
        default: Date.now
    },
    lastModifiedDate:{
        type:Date,
        default:Date.now
    }
}));

module.exports.validate = function(data){
    const transactionSchema = {
        name:joi.string().min(3).max(100).required(),
        description:joi.string().min(3).max(2048),
        tenantId:joi.string().min(3).max(100).required(),
        lastModifiedDate:joi.Date(),
    };
    return joi.validate(data,transactionSchema);
}

 