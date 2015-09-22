var db = require('../models/index');

app.get('/signup', function(req, res) {
  console.log(req.body);
  // db.User.create(req.body.user)
});