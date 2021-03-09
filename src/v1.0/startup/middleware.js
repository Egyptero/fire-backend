const express = require("express");
const cors = require("../middleware/cors");
const helmet = require("helmet");
const fileupload = require("express-fileupload");
module.exports = (app) => {
  app.use(helmet());
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(fileupload({ limits: { fileSize: 5 * 1024 * 1024 } }));
  app.use(cors);
};
