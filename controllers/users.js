var db = require('../models/index');
var routeMiddleware = require('../middleware/routeHelper.js');

app.post('/signup', routeMiddleware.preventLoginSignup, function(req, res) {
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
});

app.post('/login', routeMiddleware.preventLoginSignup, function(req,res) {
  db.User.authenticate(req.body.user, function(err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.json({success : "User logged in successfully", status : 200});
    }
    else {
      console.log(err);
      res.status(401).send({ error: 'Invalid login credentials'});
    }
  });
});

app.get('/users', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.User.findById(req.session.id, function(err, user) {
    if (err) throw err;
    res.json({email: user.email});
  });
});

app.put('/users', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.User.authenticate(req.body.current, function(err, user) {
    if (!err && user !== null) {
      if (req.body.new.password) {
        user.password = req.body.new.password;
      }
      if (req.body.new.email) {
        user.email = req.body.new.email;
      }
      user.save(function(err2, user2) {
        if (err2) throw err2;
        res.json(user.email);
      });
    }
    else {
      console.log(err);
      res.status(401).send({error: 'Invalid login credentials'});
    }
  });
});

app.get('/logout', routeMiddleware.ensureLoggedIn, function(req, res) {
  req.logout();
  res.json({success : "User logged out successfully", status : 200});
});