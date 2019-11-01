const express = require("express");
const router = express.Router();
const winston = require("winston");
const { Tenant } = require("../../models/tenant");
const fs = require("fs");

router.post("/logo", async (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  let fileName = "./tenant_logos/" + req.tenantId;
  const extension = req.files.logo.name.split(".");
  if (extension.length > 1) fileName += "." + extension[1];

  req.files.logo.mv(fileName).then(err => {
    if (err) winston.error(err);
  });

  let tenant = await Tenant.findById(req.tenantId);
  if (!tenant) return res.status(404).send("Tenant not found!!");
  tenant["logo"] = true;
  await tenant.save();
  return res.send(tenant);
});

router.get("/logo", async (req, res) => {
  
  return res.send("");
});
router.post("/docs", async (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }

  console.log("New tenants documents post");
  console.log(req.files);
  fs.mkdirSync("./tenant_files/" + req.tenantId + "/");
  if (req.files.doc0) {
    req.files.doc0
      .mv("./tenant_files/" + req.tenantId + "/" + req.files.doc0.name)
      .then(err => {
        if (err) winston.error(err);
      });
  }
  if (req.files.doc1) {
    req.files.doc1
      .mv("./tenant_files/" + req.tenantId + "/" + req.files.doc1.name)
      .then(err => {
        if (err) winston.error(err);
      });
  }
  if (req.files.doc2) {
    req.files.doc2
      .mv("./tenant_files/" + req.tenantId + "/" + req.files.doc2.name)
      .then(err => {
        if (err) winston.error(err);
      });
  }
  let tenant = await Tenant.findById(req.tenantId);
  if (!tenant) return res.status(404).send("Tenant not found!!");
  tenant["docs"] = true;
  await tenant.save();
  return res.send(tenant);
});

module.exports = router;
