
module.exports = (req,res,next)=>{
    if(!req.user) return res.status(403).send('Invalid Access, no token provided');
    if(req.user.role === "SysAdmin"){ next(); return;}
    return res.status(403).send('Access denid');
}