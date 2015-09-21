var db = require('../models/index');
var loginMiddleware = require('../middleware/loginHelper.js');

app.use(loginMiddleware);

//using locals

