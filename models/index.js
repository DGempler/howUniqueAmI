var mongoose = require('mongoose');
mongoose.connect( process.env.MONGOLAB_URI || 'mongodb://localhost/howUniqueAmI');

module.exports.User = require('./user');
module.exports.Question = require('./question');
module.exports.Answer = require('./answer');
