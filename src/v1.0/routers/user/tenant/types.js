const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { Type } = require("../../../models/type");
const verifyTypeID = require("../../../middleware/verifyTypeID");

//Get skill by ID
router.get("/:typeId", verifyTypeID, async (req, res) => {
  //We need to make sure user has access to type
  const type = await Type.findById(req.params.typeId);
  if (!type) return res.status(404).send("Type ID can not be found");
  return res.send(type);
});

//Get all types
router.get("/", async (req, res) => {
  const types = await Type.find({
    tenantId: req.tenantId
  });
  return res.send(types);
});

module.exports = router;
