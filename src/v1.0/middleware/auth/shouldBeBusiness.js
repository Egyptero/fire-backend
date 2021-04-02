module.exports = (req, res, next) => {
  if (!req.params.tenantId) req.params.tenantId = req.body.tenantId;
  if (!req.params.tenantId) req.params.tenantId = req.tenantId;
  if (!req.user)
    return res.status(403).send("Invalid Access, no token provided");
  if (req.user.role === "Business" || req.user.role === "Administrator") {
    if (req.user.tenantIds.indexOf(req.params.tenantId) > -1) {
      next();
      return;
    }
  }
  if (req.user.role === "SysAdmin") {
    next();
    return;
  }
  return res.status(403).send("Access denid");
};
