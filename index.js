const winston = require('winston');
const express = require('express');
const router = require('./startup/router');

const app = express();

winston.add(new winston.transports.Console());
winston.info(`Will define the rout points now`);
router(app);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    winston.info(`Listening on port ${port}`);
})