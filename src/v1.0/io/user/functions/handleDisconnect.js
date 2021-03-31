const { User } = require("../../../models/user");
const auth = require("../../auth/auth");
const sendMessage = require("../../system/systemMessages");
const { buttons } = require("../../common/userTools");

//For some reason user getting disconnected. We should handle this case.
module.exports = async (socket, data) => {};
