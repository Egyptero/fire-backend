const express = require("express");
const router = express.Router();
const { Tenant } = require("../../models/tenant");
const validateTenant = require("../../middleware/validateTenant");
const shouldBeUser = require("../../middleware/auth/shouldBeUser");

//Get tenant by ID
router.get("/:tenantId", validateTenant, async (req, res) => {
  //We need to make sure that user has access to tenant
  const tenant = await Tenant.findById(req.params.tenantId);
  if (!tenant) return res.status(404).send("Tenant ID can not be found");
  return res.send(tenant);
});

//Get all user tenants
router.get("/", async (req, res) => {
  const user = req.user;
  if (user.tenantIds) {
    const tenants = await Tenant.find({ _id: { $in: user.tenantIds } });
    return res.send(tenants);
  } else return res.send([]);
});

module.exports = router;
