var mongoose = require('mongoose');
var db = require('./index');

var answerSchema = new mongoose.Schema({
  answer: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }
});

var Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;