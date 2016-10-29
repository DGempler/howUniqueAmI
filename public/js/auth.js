var auth = {
  logInUser: logInUser,
  signUpUser: signUpUser
  validatePassword: validatePassword,
};

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
        $dropdown1.html($loggedInMenu);
        questionIndex = 1;
        getNextQuestion();
      },
      error: function(xhr, text, error) {
        $dropdown1.find('#password').val('');
        Materialize.toast('Invalid Email or Password', 2000);
      }
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
        $dropdown1.html($loggedInMenu);
        questionIndex = 1;
        getNextQuestion();
      },
      error: function(xhr, text, error) {
        Materialize.toast('This user email already exists', 2000);
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