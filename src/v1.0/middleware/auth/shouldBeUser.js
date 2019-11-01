module.exports = (req, res, next) => {
  if (!req.params.tenantId) req.params.tenantId = req.body.tenantId;

  if (!req.user)
    return res.status(403).send("Invalid Access, no token provided");
  console.log(req.user);
  if (
    req.user.role === "User" ||
    req.user.role === "Agent" ||
    req.user.role === "Supervisor" ||
    req.user.role === "Leader" ||
    req.user.role === "Business" ||
    req.user.role === "Adminstrator"
  )
    if (req.user.tenantIds.indexOf(req.params.tenantId) > -1) {
      next();
      return;
    }
  if (req.user.role === "SysAdmin") {
    next();
    return;
  }
  return res.status(403).send("Access denid");
};
