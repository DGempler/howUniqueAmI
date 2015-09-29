var db = require('../models/index');
var routeMiddleware = require('../middleware/routeHelper');
var request = require('request');

app.post('/answers', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Answer.findOneAndUpdate(
    {question: req.body.qID, user: req.session.id},
    {question: req.body.qID, user: req.session.id, answer: req.body.answer},
    {upsert: true},
    function(err, answer) {
      if (err) throw err;
      res.json({success : "Answer added to db successfully", status : 200});
    });
});

app.get('/answers', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Answer.find({user: req.session.id}).populate('question').exec(function(err, answers) {
    if (err) throw err;
    res.json(answers);
  });
});

app.put('/answers', routeMiddleware.ensureLoggedIn, function(req, res) {
  var answer = req.body.answer;
  db.Answer.findOneAndUpdate(
    {question: req.body.qID, user: req.session.id},
    {answer: answer},
    {upsert: true, new: true},
    function(err, answer) {
      if (err) throw err;
      res.json(answer);
    });
});

app.delete('/answers', routeMiddleware.ensureLoggedIn, function(req, res) {
  db.Answer.findByIdAndRemove(req.body.answerId, function(err, answer) {
    if (err) throw err;
    res.json(answer);
  });
});