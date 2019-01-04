require('express-async-errors');
const winston = require('winston');
const express = require('express');
const app = express();
const router = require('./startup/router');
const middleware = require('./startup/middleware');
const mongoose  =require('mongoose');
const error = require('./middleware/error');

winston.add(new winston.transports.Console());

mongoose.connect('mongodb://localhost/FIRE')
.then(winston.info('Connected to Mongo DB'))
.catch(err => winston.error('Error connecting to DB'+err));

middleware(app);
winston.info(`Middleware loadded ....`);

router(app);
winston.info(`Routes loadded ....`);

app.use(error);
winston.info(`Error Middleware Loaded at last ....`);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    winston.info(`Listening on port ${port}`);
})