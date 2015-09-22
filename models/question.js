var mongoose = require('mongoose');
var db = require('./index');

var questionSchema = new mongoose.Schema({
  content: {
    type: String,
    unique: true
  }
  categories: [String],
  //necessary?
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answer"
  }]
});

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;

var questionsArray = [
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  {content: "" categories: [""]},
  ]



