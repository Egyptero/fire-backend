const winston = require('winston');
const users = require('../routers/users');
const tenants = require('../routers/tenants');
const skillgroups = require('../routers/skillgroups');

module.exports = function(app){
    app.use('/api/users',users);
    app.use('/api/tenants',tenants);
    app.use('/api/tenants',skillgroups); // Internally /:tenantId/skillgroups
    winston.info('Route point of users is added');
}