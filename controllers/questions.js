var db = require('../models/index');
var routeMiddleware = require('../middleware/routeHelper');

app.get('/questions/:id', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Question.findOne({qID: Number(req.params.id)}, function(err, question) {
    if (err) throw err;
    res.json(question);
  });
});