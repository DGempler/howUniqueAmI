var db = require('../models/index');

// var data = {qID: qID, answerType: answerType, answer: answer};

//for generating temp user ID when user not logged in/signed up yet
// var id = mongoose.Types.ObjectId();

app.post('/answers', function(req, res) {
  var answer = req.body.answer.trim().toLowerCase();
  console.log(answer);
  db.Answer.findOneAndUpdate(
    {question: req.body.qID, user: req.session.id},
    {answer: answer},
    {upsert: true},
    function(err, answer) {
      if (err) throw err;
      res.json({success : "Answer added to db successfully", status : 200});
    });
});

/*
  console.log(req.body);
  db.Answer.findOne({question: req.body.qID, answer: req.body.answer}, function(err, answer) {
    console.log('1');
    if (err) throw err;
    db.User.findById(req.session.id, function(err2, user) {
      console.log('2');
      if (err2) throw err2;
      console.log('3');
      console.log(answer);
      if (!answer) {
        db.Question.findById(req.body.qID, function(err3, question) {
          console.log('4');
          if (err3) throw err3;
          console.log(4.1);
          db.Answer.create({answer: req.body.answer}, function(err4, answer2) {
            if (err4) throw err4;
            console.log(4.2);
            answer2.question = question._id;
            console.log(4.3);
            pushToUserAndAnswer(answer2);
          });
        });
      }
      else {
        pushToUserAndAnswer(answer);
      }

      function pushToUserAndAnswer(existingAnswer) {
        console.log('4.6');
        user.answers.push(existingAnswer);
        console.log('5');
        user.save();
        console.log('6');
        existingAnswer.users.push(user);
        console.log('7');
        existingAnswer.save();
        console.log('8');
        sendSuccess();
      }

      function sendSuccess() {
        res.json({success : "Answer added to db successfully", status : 200});
      }

    });
  });
});
*/
      // user.posts.push(post);
      // post.user = user._id;
      // post.userName = user.userName;
      // user.save();
      // post.save(function(err, post2) {