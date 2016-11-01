var dom = require('./dom');

var auth = {
  deleteUser: deleteUser,
  logInUser: logInUser,
  logOutUser: logOutUser,
  getUser: getUser,
  signUpUser: signUpUser,
  updateUser: updateUser,
  validatePassword: validatePassword,
};

function deleteUser(userData, $deleteAccountForm) {
  $.ajax({
    data: userData,
    dataType: 'json',
    url: '/users',
    method: "DELETE",
    success: function(data) {
      $deleteAccountForm.parent().remove();
      dom.$indexBanner.empty().after('<h5 class="delete-message center header col s12 light">' +
                                  'Your account has been successfully deleted. ' +
                                  'Please login to continue.</h5><br/>');
      $dropdownText.text('Log in');
      var html = loginMenu();
      dom.$dropdown1.html(html);
    },
    error: function(err) {
      if (err.status === 401) {
        Materialize.toast('Invalid Password', 2000);
      }
    }
  });
}

function logInUser(userData, $loginForm) {
  $.ajax({
    data: userData,
    dataType: 'json',
    url: '/login',
    method: 'POST',
    success: function(data) {
      $dropdownText.text('Menu');
      $loginForm.trigger('click');
      var $loggedInMenu = loggedInMenuHTML();
      dom.$dropdown1.html($loggedInMenu);
      questionIndex = 1;
      qa.getNextQuestion();
    },
    error: function(xhr, text, error) {
      dom.$dropdown1.find('#password').val('');
      Materialize.toast('Invalid Email or Password', 2000);
    }
  });
}

function logOutUser() {
  $.getJSON('/logout').done(function(data) {
    $dropdownText.text('Log in');
    var loginText = loginMenu();
    dom.$dropdown1.html(loginText);
    dom.displayIndex(false);
  });
}

function getUser() {
  var $userEditDelete = $(this);
  $.getJSON('/users').done(function(data) {
    var html = editUserAccount(data);
    $userEditDelete.after(html);
    $userEditDelete.hide();
  });
}

function signUpUser(userData) {
  var $signupForm = $(this);
  $.ajax({
    data: userData,
    dataType: 'json',
    url: '/signup',
    method: 'POST',
    success: function(data) {
      $dropdownText.text('Menu');
      $signupForm.trigger('click');
      var $loggedInMenu = loggedInMenuHTML();
      dom.$dropdown1.html($loggedInMenu);
      questionIndex = 1;
      qa.getNextQuestion();
    },
    error: function(xhr, text, error) {
      Materialize.toast('This user email already exists', 2000);
    }
  });
}

function updateUser(userData, $editAccountForm) {
  $.ajax({
    data: userData,
    dataType: 'json',
    url: '/users',
    method: 'PUT',
    success: function(data) {
      $editAccountForm.parent().remove();
      dom.$indexBanner.find('#user-edit-delete').show().after('<h5 class="edit-message header ' +
                      'col s12 light">Your account has been successfully updated.</h5><br/>');
    },
    error: function(err) {
      if (err.status === 401) {
        Materialize.toast('Invalid Password', 2000);
      }
      if (err.status === 409) {
        Materialize.toast('This user email already exists', 2000);
      }
    }
  });
}

function validatePassword(pass, confPass) {
  if (pass !== confPass) {
    document.getElementById('confirm-password').setCustomValidity("Passwords Don't Match");
    return false;
  }
  else {
    document.getElementById('confirm-password').setCustomValidity('');
    return true;
  }
}

module.exports = auth;
