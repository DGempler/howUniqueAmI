var db = require('../models');

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    }
    else {
      res.redirect('/');
    }
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/');
    }
    else {
      return next();
    }
  }
};

module.exports = routeHelpers;