const mongoose = require('mongoose');
const joi = require('joi');

module.exports.Interaction = mongoose.model('interaction_realtime',new mongoose.Schema({
    from:String,
    to:String,
    application:String,
    skillgroupId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Skillgroup'
    },
    attached:Object,
    createDate:{
        type:Date,
        default: Date.now
    },
    lastModifiedDate:{
        type:Date,
        default:Date.now
    },
    stage:{
        type:String,
        default:'New',
        enum: ['New','Loggin','Reserved','Queue','Handle','Hold','Close']
    }
}));

module.exports.validate = function(data){
    const interactionSchema = {
        firstname:joi.string().min(3).max(20),
        lastname:joi.string().min(3).max(20),
        username:joi.string().min(5).required(),
        password:joi.string().min(8).max(200).required(),
        email:joi.string().email().required(),
        role:joi.string()
    };
    return joi.validate(data,interactionSchema);
}

 