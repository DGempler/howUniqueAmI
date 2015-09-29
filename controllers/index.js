var db = require('../models/index');
var loginMiddleware = require('../middleware/loginHelper.js');

app.use(loginMiddleware);

//using locals
app.use(function(req, res, next) {
  if (req.session.id) {
    db.User.findById(req.session.id, function(err, user) {
      if (err) throw err;
      res.locals.user = user._id;
      next();
    });
  }
  else {
    res.locals.user = null;
    next();
  }
});

app.get('/', function(req, res) {
  var localsUser;
  if (res.locals.user) {
    localsUser = true;
  }
  else {
    localsUser = false;
  }
  res.render('index', {localsUser: localsUser});
});

require('./users');
require('./questions');
require('./answers');

app.get('*', function(req, res) {
  res.render('../public/html/404');
});