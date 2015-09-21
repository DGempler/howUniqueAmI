var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema({
  userName: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }],
  answers: [{
    type: mongoose.Schema.Type.ObjectId,
    ref: "Answer"
  }]
});

userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, function(err2, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});