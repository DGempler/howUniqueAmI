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
  db.User.findById(req.session.id, function(err, user) {
    if (err) throw err;
    user.checkPassword(req.body.current.password, function(err2, user2) {
      if (!err2 && user2 !== null) {
        if (req.body.upcoming.password != 0) {
          user2.password = req.body.upcoming.password;
          user2.save();
        }
        if (req.body.upcoming.email != 0) {
          db.User.findOne({email: req.body.upcoming.email}, function(err3, user3) {
            if (err3) throw err3;
            if (user3 == null) {
              user2.email = req.body.upcoming.email;
              user2.save(function(err4, user4) {
                if (err4) {
                  console.log(err4);
                }
                else {
                  res.json({email: user4.email});
                }
              });
            }
            else {
              res.status(409).send({error: 'The request could not be completed due to a conflict'});
            }
          });
        }
        else {
          res.json({email: user2.email});
        }
      }
      else {
        console.log(err2);
        req.logout();
        res.status(401).send({error: 'Invalid login credentials'});
      }
    });
  });
});

app.delete('/users', routeMiddleware.ensureLoggedIn, function(req, res) {

  db.User.findById(req.session.id, function(err, user) {
    if (err) throw err;
    user.checkPassword(req.body.password, function(err2, user2) {
      if (!err2 && user2 !== null) {
        user2.remove(function(err3, user3) {
          if (err3) throw err3;
          req.logout();
          res.json({email: user3.email});
        });
      }
      else {
        console.log(err2);
        res.status(401).send({error: 'Invalid login credentials'});
      }
    });
  });
});

app.get('/logout', routeMiddleware.ensureLoggedIn, function(req, res) {
  req.logout();
  res.json({success : "User logged out successfully", status : 200});
});