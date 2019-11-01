require("express-async-errors");
const winston = require("winston");
const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const router = require("./v1.0/startup/router");
const middleware = require("./v1.0/startup/middleware");
const mongoose = require("mongoose");
const error = require("./v1.0/middleware/error");
const config = require("config");
const fs = require("fs");
const privateKey = fs.readFileSync("./ssl/cloud_firemisc_com.key", "utf8");
const certificate = fs.readFileSync("./ssl/cloud_firemisc_com.crt", "utf8");
const ca = fs.readFileSync("./ssl/DigiCertCA.crt", "utf8");
const credentials = { key: privateKey, cert: certificate, ca: ca };

winston.add(new winston.transports.Console());
winston.add(
  new winston.transports.File({
    filename: "./logs/Fire-Core.log",
    maxsize: 1024, // makes timestamp 'pretty'
    level: "debug"
  })
);

if (!config.get("jwtPrivateKey")) {
  winston.error(
    "You need to define jwtPrivateKey" + `Current Env is ${app.get("env")}`
  );
  process.exit(1);
}
if (!config.get("firePort")) {
  winston.error(
    "You need to define port in the configuration" +
      `Current Env is ${app.get("env")}`
  );
  process.exit(1);
}

mongoose
  .connect(config.get("dbUrl"), { useNewUrlParser: true })
  .then(winston.info(`Connected to Mongo DB @ ${config.get("dbUrl")}`))
  .catch(err => winston.error("Error connecting to DB" + err));

middleware(app);
router(app);

app.use(error);
const port = config.get("firePort");

const httpsServer = https.createServer(credentials, app);
const httpServer = http.createServer(app);
const environment = process.env.NODE_ENV || "development";

if (environment === "development" || environment === "uat") {
  const io = require("socket.io")(httpServer);
  const ioHandler = require("./v1.0/io/handler");

  httpServer.listen(port, () => {
    winston.info(`FIRE- Backend started on port ${port}`);
    ioHandler.loadServerIO(io);
    winston.info(`Agent Event Channel Started at http://localhost:${port}`);
  });
} else {
  const io = require("socket.io")(httpsServer);
  const ioHandler = require("./v1.0/io/handler");

  httpsServer.listen(port, () => {
    winston.info(`FIRE- Backend started on port ${port}`);
    ioHandler.loadServerIO(io);
    winston.info(`Agent Event Channel Started at https://localhost:${port}`);
  });
}
