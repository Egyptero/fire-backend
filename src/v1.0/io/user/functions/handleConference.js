const { User } = require("../../../models/user");
const auth = require("../../auth/auth");
const sendMessage = require("../../system/systemMessages");
const { buttons } = require("../../common/userTools");

module.exports = async (socket, data, requester) => {
  console.log("Request to conference interation and data");
  console.log(data);
};
