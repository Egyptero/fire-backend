const winston = require("winston");
const me = require("../routers/user/me");
const feedbacks = require("../routers/user/feedbacks");
const userLogs = require("../routers/user/userlogs");
const userTodos = require("../routers/user/todos");
const userQueues = require("../routers/user/queues");
const userTenantQueues = require("../routers/user/tenant/queues"); //Queues under tenant of specific user
const userTenantFacebookQueues = require("../routers/user/tenant/queue/queuesFacebook"); //Facebook Queues under tenant of specific user
const userTenantTwitterQueues = require("../routers/user/tenant/queue/queuesTwitter"); //Twitter Queues under tenant of specific user
const userTenantInstagramQueues = require("../routers/user/tenant/queue/queuesInstagram"); //Instagram Queues under tenant of specific user
const userTenantCallQueues = require("../routers/user/tenant/queue/queuesCall"); //Call Queues under tenant of specific user
const userTenantEmailQueues = require("../routers/user/tenant/queue/queuesEmail"); //Email Queues under tenant of specific user
const userTenantChatQueues = require("../routers/user/tenant/queue/queuesChat"); //Chat Queues under tenant of specific user
const userTenantProjectQueues = require("../routers/user/tenant/queue/queuesProject"); //Project Queues under tenant of specific user
const userTenantWhatsAppQueues = require("../routers/user/tenant/queue/queuesWhatsApp"); //Project Queues under tenant of specific user
const userTenantTypes = require("../routers/user/tenant/types");
const userTenantHistory = require("../routers/user/tenant/history");
const userSkillgroups = require("../routers/user/skillgroups");
const userTenantSkillgroups = require("../routers/user/tenant/skillgroups"); //Queues skillgroup under tenant under specific user
const userTeams = require("../routers/user/teams");
const userInteractions = require("../routers/user/interactions");
const userTenants = require("../routers/user/tenants");
const customerLogs = require("../routers/customer/customerlogs");
const auth = require("../routers/auth");
const verify = require("../routers/verify");
const requestReset = require("../routers/requestreset");
const processReset = require("../routers/processreset");
const activate = require("../routers/activate");
const users = require("../routers/users");
const customers = require("../routers/customers");
const skillgroups = require("../routers/skillgroups");
const interactions = require("../routers/interactions");
const transactions = require("../routers/transactions");
const tenants = require("../routers/tenants");
const tenantUpload = require("../routers/tenant/uploads");
const tenantUsers = require("../routers/tenant/users");
const tenantCustomers = require("../routers/tenant/customers");
const tenantWorkflows = require("../routers/tenant/workflows");
const tenantTypes = require("../routers/tenant/types");
const tenantSkillgroups = require("../routers/tenant/skillgroups");
const tenantInteractionLogs = require("../routers/tenant/interactionlogs");
const tenantSkillgroupLogs = require("../routers/tenant/skillgrouplogs");
const tenantInteractions = require("../routers/tenant/interactions");
const tenantTransactions = require("../routers/tenant/transactions");
const tenantCustomerInteractions = require("../routers/tenant/customer/interactions");
const tenantSkillgroupInteractions = require("../routers/tenant/skillgroup/interactions");
const tenantInteractionsInteractionLogs = require("../routers/tenant/interaction/interactionlogs");
const tenantSkillgroupsSkillgroupLogs = require("../routers/tenant/skillgroup/skillgrouplogs");
const validateTenant = require("../middleware/validateTenant");
const validateCustomer = require("../middleware/validateCustomer");
const validateSkillgroup = require("../middleware/validateSkillgroup");
const validateInteraction = require("../middleware/validateInteraction");
const validateWorkflow = require("../middleware/validateWorkflow");
const validateType = require("../middleware/validateType");
const validateTodo = require("../middleware/validateTodo");
const verifyUserID = require("../middleware/verifyUserID");
const verifyTenantID = require("../middleware/verifyTenantID");
const verifyCustomerID = require("../middleware/verifyCustomerID");
const verifyWorkflowID = require("../middleware/verifyWorkflowID");
const verifyTypeID = require("../middleware/verifyTypeID");
const verifyTodoID = require("../middleware/verifyTodoID");
const verifySkillgroupID = require("../middleware/verifySkillgroupID");
const verifyInteractionID = require("../middleware/verifyInteractionID");
const shouldBeTenantAdmin = require("../middleware/auth/shouldBeTenantAdmin");
const shouldBeBusiness = require("../middleware/auth/shouldBeBusiness");
const shouldBeSysAdmin = require("../middleware/auth/shouldBeSysAdmin");
const shouldBeSupervisor = require("../middleware/auth/shouldBeSupervisor");
const shouldBeAgent = require("../middleware/auth/shouldBeAgent");
const shouldBeUser = require("../middleware/auth/shouldBeUser");

const authorize = require("../middleware/auth");

module.exports = function(app) {
  app.get("/", (req, res) => {
    res.sendFile("index.html");
  });
  app.use("/api/v1.0/auth", auth); //Authentication Module to generate token after login
  app.use("/api/v1.0/requestreset", requestReset); //User requested password reset during login
  app.use("/api/v1.0/processreset", processReset); //User requested password reset during login
  app.use("/api/v1.0/activate", activate); //Activate user via link from email
  app.use("/api/v1.0/verify", authorize, verify); //Verify user registeration via email
  app.use("/api/v1.0/users/me", authorize, me); // Should be invoked before users
  app.use(
    "/api/v1.0/users/:userId/logs",
    authorize,
    verifyUserID,
    shouldBeBusiness,
    userLogs
  ); // Should be invoked before users
  //User Todos
  app.use("/api/v1.0/users/me/todos", authorize, userTodos);
  //User Feedback
  app.use("/api/v1.0/users/me/feedbacks", authorize, feedbacks);
  //User Queues
  app.use("/api/v1.0/users/me/queues", authorize, userQueues);
  //User Project Queues under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/queues/project",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantProjectQueues
  );
  //User WhatsApp Queues under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/queues/whatsapp",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantWhatsAppQueues
  );
  //User Chat Queues under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/queues/chat",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantChatQueues
  );
  //User Email Queues under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/queues/email",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantEmailQueues
  );
  //User Call Queues under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/queues/call",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantCallQueues
  );
  //User Instagram Queues under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/queues/instagram",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantInstagramQueues
  );
  //User Facebook Queues under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/queues/twitter",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantTwitterQueues
  );
  //User Facebook Queues under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/queues/facebook",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantFacebookQueues
  );
  //User Queues under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/queues",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantQueues
  );
  //User Types under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/types",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantTypes
  );
  //User History under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/history",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantHistory
  );

  //User team
  app.use("/api/v1.0/users/me/teams", authorize, userTeams);
  //User skillgroups
  app.use("/api/v1.0/users/me/skillgroups", authorize, userSkillgroups);
  //User Skillgroup Queue under certain tenant
  app.use(
    "/api/v1.0/users/me/tenants/:tenantId/skillgroups",
    authorize,
    verifyTenantID,
    validateTenant,
    userTenantSkillgroups
  );

  //User interactions
  app.use("/api/v1.0/users/me/interactions", authorize, userInteractions);
  //User tenants
  app.use("/api/v1.0/users/me/tenants", authorize, userTenants);

  app.use("/api/v1.0/users", users); //Only Create User Open to public , rest are closed to SysAdmin
  app.use("/api/v1.0/customers", customers);
  app.use(
    "/api/v1.0/customers/:customerId/logs",
    authorize,
    verifyCustomerID,
    shouldBeSysAdmin,
    customerLogs
  );
  app.use("/api/v1.0/skillgroups", authorize, shouldBeSysAdmin, skillgroups);
  app.use("/api/v1.0/transactions", authorize, shouldBeSysAdmin, transactions);
  app.use("/api/v1.0/interactions", authorize, shouldBeSysAdmin, interactions);
  app.use("/api/v1.0/tenants", authorize, tenants); //Create Tenant Open to public , rest are closed to TenantAdmin
  app.use(
    "/api/v1.0/tenants/:tenantId/interactions/:interactionId/logs",
    authorize,
    verifyTenantID,
    validateTenant,
    verifyInteractionID,
    validateInteraction,
    shouldBeAgent,
    tenantInteractionsInteractionLogs
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/customers/:customerId/interactions",
    authorize,
    verifyTenantID,
    validateTenant,
    verifyCustomerID,
    validateCustomer,
    shouldBeAgent,
    tenantCustomerInteractions
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/skillgroups/:skillgroupId/logs",
    authorize,
    verifyTenantID,
    validateTenant,
    verifySkillgroupID,
    validateSkillgroup,
    shouldBeAgent,
    tenantSkillgroupsSkillgroupLogs
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/skillgroups/:skillgroupId/interactions",
    authorize,
    verifyTenantID,
    validateTenant,
    verifySkillgroupID,
    validateSkillgroup,
    shouldBeAgent,
    tenantSkillgroupInteractions
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/upload",
    authorize,
    verifyTenantID,
    validateTenant,
    shouldBeTenantAdmin,
    tenantUpload
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/users",
    authorize,
    verifyTenantID,
    validateTenant,
    shouldBeAgent,//shouldBeBusiness
    tenantUsers
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/skillgroups",
    authorize,
    verifyTenantID,
    validateTenant,
    shouldBeAgent,//shouldBeBusiness
    tenantSkillgroups
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/customers",
    authorize,
    verifyTenantID,
    validateTenant,
    shouldBeBusiness,
    tenantCustomers
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/workflows",
    authorize,
    verifyTenantID,
    validateTenant,
    shouldBeBusiness,
    tenantWorkflows
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/types",
    authorize,
    verifyTenantID,
    validateTenant,
    shouldBeAgent, //shouldBeBusiness
    tenantTypes
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/interactions",
    authorize,
    verifyTenantID,
    validateTenant,
    shouldBeBusiness,
    tenantInteractions
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/transactions",
    authorize,
    verifyTenantID,
    validateTenant,
    shouldBeBusiness,
    tenantTransactions
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/interactionlogs",
    authorize,
    verifyTenantID,
    validateTenant,
    shouldBeBusiness,
    tenantInteractionLogs
  );
  app.use(
    "/api/v1.0/tenants/:tenantId/skillgrouplogs",
    authorize,
    verifyTenantID,
    validateTenant,
    shouldBeBusiness,
    tenantSkillgroupLogs
  );
  winston.info("Route point of users is added");
};
