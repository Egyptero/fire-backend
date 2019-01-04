const mongoose = require('mongoose');
const joi = require('joi');

module.exports.User = mongoose.model('user',new mongoose.Schema({
    firstname:String,
    lastname:String,
    username:{
        type:String,
        required:true,
        unique:true,
        min:5
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    skillIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Skillgroup'
    }],
    tenantIds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tenant'
    }],
    role:{
        type:String,
        enum : ['User','Agent','Supervisor','Leader','Operator','Administrator'],
        default:'User'
    }

}));

module.exports.validate = function(data){
    const userSchema = {
        firstname:joi.string().min(3).max(20),
        lastname:joi.string().min(3).max(20),
        username:joi.string().min(5).required(),
        password:joi.string().min(8).max(200).required(),
        email:joi.string().email().required(),
        role:joi.string()
    };
    return joi.validate(data,userSchema);
}

 