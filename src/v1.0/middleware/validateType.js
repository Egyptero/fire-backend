const winston = require("winston");
const mongoose = require("mongoose");
const { Type } = require("../models/type");

module.exports = async (req, res, next) => {
  winston.info("Verify type id as typeId in the req.params");
  if (!req.params.typeId) req.params.typeId = req.body.typeId;
  req.typeId = req.params.typeId;
  const validTypeId = mongoose.Types.ObjectId.isValid(req.params.typeId);
  if (!validTypeId) return res.status(400).send("Invalid type id");

  const type = await Type.find({ _id: req.params.typeId });
  if (type.length < 1)
    return res.status(404).send("No type found with the given ID");
  next();
};
