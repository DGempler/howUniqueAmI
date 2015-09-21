var mongoose = require('mongoose');
var db = require('./index');

var answerSchema = new mongoose.Schema({
  answer: {
    type: String,
    lowercase: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }
});

answerSchema.pre('remove', function(next) {
  var answer = this;
  db.User.findByIdAndUpdate(answer.user, {$pull: {answers: answer._id}}, function(err, user) {
    if (err) throw err;
    //this only necessary if answer ref is left on question model. Don't forget to move next() back up
    db.Question.findByIdAndUpdate(answer.question, {$pull: {answers: answer._id}}, function(err, question) {
      if (err) throw err;
      next();
    });
  });
});