var mongoose = require('mongoose');
var db = require('./index');

var questionSchema = new mongoose.Schema({
  content: String,
  categories: [String],
});

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;




