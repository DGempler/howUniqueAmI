var auth = require('./auth');

function eventHandlers = {

  var $body = $('body');
  var $nav = $('nav');
  var $indexBanner = $('#index-banner');
  var $dropdown1 = $('#dropdown1');
  var $dropdownButton = $nav.find('.dropdown-button');
  var $dropdownText = $dropdownButton.find('#dropdown-text');
  var $questionLinks =$('#question-links');

  function signupLinkClickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    var $passwordConfirm = $('<div class="input-field"><input type="password" ' +
                            'name="user[confirmPassword]" id="confirm-password" ' +
                            'placeholder="Confirm Password" required/></div>');
    $passwordConfirm.insertBefore('#login-button');
    changeFormType.call(this, 'login', 'signup', 'Log in instead', 'Sign up');
  }

  function loginLinkClickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    var $form = changeFormType.call(this, 'signup', 'login', 'Sign Up', 'Log in');
    $form.find('#confirm-password').parent().remove();
  }

  function signupFormSubmitHandler(e) {
    e.preventDefault();
    var email = $dropdown1.find('#email').val();
    var password = $dropdown1.find('#password').val();
    var userData = {user: {email: email, password: password}};
    if (passwordCheck) {
      auth.signUpUser.call(this, userData);
    }
  }

  function loggedInLinksClickHandler(e) {
    e.preventDefault();
    if ($(this).find('a').attr('id') === "logout") {
      logOutUser();
    }
    else if ($(this).find('a').attr('id') === "my-account") {
      displayUserAccount();
    }
    else if ($(this).find('a').hasClass('start-button')) {
      startQuestions();
    }
    else if ($(this).find('a').hasClass('unique-button')) {
      $indexBanner.empty();
      $questionLinks.empty();
      getResults();
    }
  }

  function userEditDeleteClickHandler(e) {
    e.preventDefault();
    $indexBanner.find('.edit-message').remove();
    getUser.call(this);
  }

  function editAccountSubmitHandler(e) {
      e.preventDefault();
      var $editAccountForm = $(this);
      var currentEmail = $editAccountForm.find('#current-email').val();
      var email = $editAccountForm.find('#email').val();
      var currentPassword = $editAccountForm.find('#current-password').val();
      var password = $editAccountForm.find('#password').val();
      if (currentEmail === email && password === "") {
        notifyNoChangesMade($editAccountForm);
      }
      else {
        if (currentEmail === email) {
          email = 0;
        }
        if (password === "") {
          password = 0;
        }
        var userData = {current: {email: currentEmail, password: currentPassword},
                        upcoming: {email: email, password: password}};
        updateUser(userData, $editAccountForm);
      }
    }

    function qLinksClickHandler(e) {
    e.preventDefault();
    questionIndex = $(this).attr('data-qId');
    var $questionForm = $('#question-form');
    getAnswerAndSubmit($questionForm, getNextQuestion);
  }

  function passwordKeyupHandler() {
    var $confirmPassword = $('#confirm-password');
    if ($confirmPassword.length) {
      var $password = $('#password').val();
      $confirmPassword = $confirmPassword.val();
      passwordCheck = auth.validatePassword($password, $confirmPassword);
    }
  }

  function confirmPasswordKeyupHandler() {
    var $password = $('#password').val();
    var $confirmPassword = $('#confirm-password').val();
    passwordCheck = auth.validatePassword($password, $confirmPassword);
  }

  function logoClickHandler(e) {
    e.preventDefault();
    displayIndex(false);
  }

  function startButtonClickHandler(e) {
    e.preventDefault();
    startQuestions();
  }

  function backButtonClickHandler(e) {
    e.preventDefault();
    questionIndex -= 2;
    getNextQuestion();
  }

  function skipButtonClickHandler(e) {
    e.preventDefault();
    getNextQuestion();
  }

  function questionFormSubmitHandler(e) {
    e.preventDefault();
    //check b-day for age HERE
    var $questionForm = $(this);
    getAnswerAndSubmit($questionForm, getNextQuestion);
  }

  function uniqueButtonClickHandler(e) {
    e.preventDefault();
    var $questionForm = $('#question-form');
    if ($questionForm.length !== 0) {
      getAnswerAndSubmit($questionForm, getResults, true);
    }
    else {
      getResults();
    }
  }

  function deleteAnswerButtonClickHandler(e) {
    e.preventDefault();
    var $answer = $(this).parent();
    var answerId = $(this).attr('data-deleteId');
    var qId = $(this).attr('data-qID');
    var answerData = {answerId: answerId};
    deleteAnswer(answerData, $answer, qId);
  }

  function editAnswerButtonClickHandler(e) {
    e.preventDefault();
    var $answer = $(this).parent();
    var qId = Number($(this).attr('data-qId'));
    getQuestionAndCreateEditForm(qId, $answer);
  }

  function editCancelButtonClickHandler(e) {
    e.preventDefault();
    var $questionForm = $(this).parent();
    $questionForm.prev().show();
    $questionForm.remove();
  }

  function editAnswerFormSubmitHandler(e) {
    e.preventDefault();
    var $questionForm = $(this);
    var mongId = $questionForm.attr('data-qMongId');
    var $input = $questionForm.find('input');
    var answer = $input.val().trim();
    if (answer !== "" && answer !== "Choose your option") {
      var answerData = {qID: mongId, answer: answer};
      editAnswer(answerData, $questionForm);
    } else {
      $questionForm.prev().show();
      $questionForm.remove();
    }
  }

  function loginFormSubmitHandler(e) {
    e.preventDefault();
    var $loginForm = $(this);
    var email = $loginForm.find('#email').val();
    var password = $loginForm.find('#password').val();
    var userData = {user: {email: email, password: password}};
    auth.logInUser(userData, $loginForm);
  }

  $dropdown1.on('click', '#signup-link', signupLinkClickHandler);
  $dropdown1.on('click', '#login-link', loginLinkClickHandler);
  $dropdown1.on('submit', '#signup-form', signupFormSubmitHandler);
  $dropdown1.on('submit', '#login-form', loginFormSubmitHandler);
  $dropdown1.on('click', '.logged-in-links', loggedInLinksClickHandler);
  $dropdown1.on('keyup', '#password', passwordKeyupHandler);
  $dropdown1.on('keyup', '#confirm-password', confirmPasswordKeyupHandler);
  $questionLinks.on('click', '.qLinks', qLinksClickHandler);
  $nav.on('click', '#logo', logoClickHandler);

  $indexBanner.on('click', '#user-edit-delete', userEditDeleteClickHandler);
  $indexBanner.on('submit', '#edit-account-form', editAccountSubmitHandler);
  $indexBanner.on('submit', '#delete-account-form', deleteAccountSubmitHandler);

  $indexBanner.on('click', '.start-button', startButtonClickHandler);
  $indexBanner.on('click', '#back-button', backButtonClickHandler);
  $indexBanner.on('click', '#skip-button', skipButtonClickHandler);

  $indexBanner.on('submit', '#question-form', questionFormSubmitHandler);
  $indexBanner.on('click', '#skip-submit-button', getResults);
  $indexBanner.on('click', '.unique-button', uniqueButtonClickHandler);
  $indexBanner.on('click', '.delete-answer-button', deleteAnswerButtonClickHandler);
  $indexBanner.on('click', '.edit-answer-button', editAnswerButtonClickHandler);
  $indexBanner.on('click', '.cancel-button', editCancelButtonClickHandler);
  $indexBanner.on('submit', '.edit-answer-form', editAnswerFormSubmitHandler);

  $dropdown1.on('click', 'input', function(e) {
    e.stopPropagation();
  });
  $dropdown1.on('click', 'button', function(e) {
    e.stopPropagation();
  });
  $nav.find('#login-signup').on("click", function(e) {
    e.preventDefault();
  });
  $nav.find('#nav-mobile').on('click', function(e) {
    e.preventDefault();
  });

}

module.exports = eventHandlers;