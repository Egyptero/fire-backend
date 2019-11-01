const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Tenant, validate } = require("../models/tenant");
const { User } = require("../models/user");
const verifyTenantID = require("../middleware/verifyTenantID");
const shouldBeTenantAdmin = require("../middleware/auth/shouldBeTenantAdmin");
const shouldBeUser = require("../middleware/auth/shouldBeUser");
const logTenantChange = require("../functions/logger/logTenantChange");
const logUserChange = require("../functions/logger/logUserChange");

//Create new tenant
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let tenant = await Tenant.find({ email: req.body.email }).or({
    name: req.body.name
  });
  if (tenant.length > 0)
    return res.status(400).send("Email or name already exist");
  tenant = new Tenant(req.body);
  tenant.adminId = req.user._id;
  tenant = await tenant.save();
  await logTenantChange(tenant, "Create", req.user._id);
  //Update user role to be Administrator
  const user = await User.findById(req.user._id);
  if (user.role != "SysAdmin") user.role = "Administrator";

  user.tenantId = tenant._id;
  user.tenantIds.push(tenant._id);
  await user.save();

  logUserChange(user, "Update", req.user._id);
  return res.send(tenant);
});

//Update tenant
router.put(
  "/:tenantId",
  shouldBeTenantAdmin,
  verifyTenantID,
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const tenant = await Tenant.findOneAndUpdate(
      { _id: req.params.tenantId, adminId: req.user._id },
      req.body,
      { new: true }
    );
    if (!tenant)
      return res
        .status(404)
        .send("Tenant id not found or you do not have admin access");
    logTenantChange(tenant, "Update", req.user._id);
    return res.send(tenant);
  }
);

//Delete tenant
router.delete(
  "/:tenantId",
  shouldBeTenantAdmin,
  verifyTenantID,
  async (req, res) => {
    let tenant = await Tenant.findOneAndDelete({
      _id: req.params.tenantId,
      adminId: req.user._id
    });
    if (!tenant)
      return res
        .status(404)
        .send("Tenant id not found or you do not have admin access");
    logTenantChange(tenant, "Delete", req.user._id);
    return res.send(tenant);
  }
);

//Get Tenant by ID
router.get(
  "/:tenantId",
  shouldBeTenantAdmin,
  verifyTenantID,
  async (req, res) => {
    const tenant = await Tenant.findOne({
      _id: req.params.tenantId,
      adminId: req.user._id
    });
    if (!tenant) return res.status(404).send("Tenant ID can not be found");
    await logTenantChange(tenant, "Read", req.user._id);
    return res.send(tenant);
  }
);

//Get all tenants
router.get("/", async (req, res) => {
  const roles = ["Administrator", "SysAdmin"];
  if (roles.indexOf(req.user.role) < 0)
    return res
      .status(403)
      .send("Forbidden - Administrator privilage is required.");
  const tenants = await Tenant.find({ adminId: req.user._id });
  return res.send(tenants);
});

module.exports = router;
