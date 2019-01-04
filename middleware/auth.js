const winston = require('winston');

module.exports = (req,res,next)=>{
    //TODO process the authorization
    winston.info('Authorization middleware engaged');
    next();
}