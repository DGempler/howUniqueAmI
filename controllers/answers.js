var db = require('../models/index');

app.post('/questions/:id/answers', function(req, res) {
  console.log(req.session.id);
  db.Answer.find({question: req.params.id, answer: req.body.answer}, function(err, answer) {
    console.log('1');
    if (err) throw err;
    db.User.findById(req.session.id, function(err2, user) {
      console.log('2');
      if (err2) throw err2;
      if (!answer) {
        db.Question.findById(req.params.id, function(err3, question) {
          console.log('3');
          if (err3) throw err3;
          var newAnswer = new db.Answer(req.body.answer, function(err4, answer2) {
            if (err4) throw err4;
            answer2.push(question);
            answer2.push(user);
            answer2.save();
          });
        });
      }
      user.answers.push(answer);
      user.save();
      answer.users.push(user);
      answer.save();
    });
  });
});