const { Node, validate } = require("../../models/node");
const winston = require("winston");
module.exports.startNodeLog = async data => {
  const { error } = validate(data);
  if (error) return winston.info(error.details[0].message);
  let currentnode = new Node(data);
  await currentnode.save();
  return currentnode._id;
};

module.exports.stopNodeLog = async (id, data) => {
  const { error } = validate(data);
  if (error) return winston.info(error.details[0].message);
  let node = await Node.findByIdAndUpdate(id, data, { new: true });
  return node;
};
