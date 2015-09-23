var db = require('../models/index');

app.post('/signup', function(req, res) {
  console.log(req.body);
  db.User.create(req.body.user, function(err, user) {
    if (err) {
      console.log(err);
      res.status(500).send('Something broke!');
    }
    else {
      req.login(user);
      res.json({success : "User added successfully", status : 200});
    }
  });



  // db.User.create(req.body.user)
});