var auth = require('./auth');
var dom = require('./dom');
var qa = require('./queestionAnswer');
var result = require('./result.js');

function eventHandlers() {

  var passwordCheck;

  function signupLinkClickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    var $passwordConfirm = $('<div class="input-field"><input type="password" ' +
                            'name="user[confirmPassword]" id="confirm-password" ' +
                            'placeholder="Confirm Password" required/></div>');
    $passwordConfirm.insertBefore('#login-button');
    dom.changeFormType.call(this, 'login', 'signup', 'Log in instead', 'Sign up');
  }

  function loginLinkClickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    var $form = dom.changeFormType.call(this, 'signup', 'login', 'Sign Up', 'Log in');
    $form.find('#confirm-password').parent().remove();
  }

  function signupFormSubmitHandler(e) {
    e.preventDefault();
    var email = dom.$dropdown1.find('#email').val();
    var password = dom.$dropdown1.find('#password').val();
    var userData = {user: {email: email, password: password}};
    if (passwordCheck) {
      auth.signUpUser.call(this, userData);
    }
  }

  function loggedInLinksClickHandler(e) {
    e.preventDefault();
    if ($(this).find('a').attr('id') === "logout") {
      auth.logOutUser();
    }
    else if ($(this).find('a').attr('id') === "my-account") {
      dom.displayUserAccount();
    }
    else if ($(this).find('a').hasClass('start-button')) {
      qa.startQuestions();
    }
    else if ($(this).find('a').hasClass('unique-button')) {
      dom.$indexBanner.empty();
      dom.$questionLinks.empty();
      result.getResults();
    }
  }

  function userEditDeleteClickHandler(e) {
    e.preventDefault();
    dom.$indexBanner.find('.edit-message').remove();
    auth.getUser.call(this);
  }

  function editAccountSubmitHandler(e) {
    e.preventDefault();
    var $editAccountForm = $(this);
    var currentEmail = $editAccountForm.find('#current-email').val();
    var email = $editAccountForm.find('#email').val();
    var currentPassword = $editAccountForm.find('#current-password').val();
    var password = $editAccountForm.find('#password').val();
    if (currentEmail === email && password === "") {
      dom.notifyNoChangesMade($editAccountForm);
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
      auth.updateUser(userData, $editAccountForm);
    }
  }

  function qLinksClickHandler(e) {
    e.preventDefault();
    dom.questionIndex = $(this).attr('data-qId');
    var $questionForm = $('#question-form');
    qa.getAnswerAndSubmit($questionForm, qa.getNextQuestion);
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
    dom.displayIndex(false);
  }

  function startButtonClickHandler(e) {
    e.preventDefault();
    qa.startQuestions();
  }

  function backButtonClickHandler(e) {
    e.preventDefault();
    dom.questionIndex -= 2;
    qa.getNextQuestion();
  }

  function skipButtonClickHandler(e) {
    e.preventDefault();
    qa.getNextQuestion();
  }

  function questionFormSubmitHandler(e) {
    e.preventDefault();
    //check b-day for age HERE
    var $questionForm = $(this);
    qa.getAnswerAndSubmit($questionForm, qa.getNextQuestion);
  }

  function uniqueButtonClickHandler(e) {
    e.preventDefault();
    var $questionForm = $('#question-form');
    if ($questionForm.length !== 0) {
      qa.getAnswerAndSubmit($questionForm, result.getResults, true);
    }
    else {
      result.getResults();
    }
  }

  function deleteAccountSubmitHandler(e) {
    e.preventDefault();
    var $deleteAccountForm = $(this);
    var password = $deleteAccountForm.find('#delete-password').val();
    var userData = {password: password};
    auth.deleteUser(userData, $deleteAccountForm);
  }

  function deleteAnswerButtonClickHandler(e) {
    e.preventDefault();
    var $answer = $(this).parent();
    var answerId = $(this).attr('data-deleteId');
    var qId = $(this).attr('data-qID');
    var answerData = {answerId: answerId};
    qa.deleteAnswer(answerData, $answer, qId);
  }

  function editAnswerButtonClickHandler(e) {
    e.preventDefault();
    var $answer = $(this).parent();
    var qId = Number($(this).attr('data-qId'));
    qa.getQuestionAndCreateEditForm(qId, $answer);
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
      qa.editAnswer(answerData, $questionForm);
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

  dom.$dropdown1.on('click', '#signup-link', signupLinkClickHandler);
  dom.$dropdown1.on('click', '#login-link', loginLinkClickHandler);
  dom.$dropdown1.on('submit', '#signup-form', signupFormSubmitHandler);
  dom.$dropdown1.on('submit', '#login-form', loginFormSubmitHandler);
  dom.$dropdown1.on('click', '.logged-in-links', loggedInLinksClickHandler);
  dom.$dropdown1.on('keyup', '#password', passwordKeyupHandler);
  dom.$dropdown1.on('keyup', '#confirm-password', confirmPasswordKeyupHandler);
  dom.$questionLinks.on('click', '.qLinks', qLinksClickHandler);
  dom.$nav.on('click', '#logo', logoClickHandler);

  dom.$indexBanner.on('click', '#user-edit-delete', userEditDeleteClickHandler);
  dom.$indexBanner.on('submit', '#edit-account-form', editAccountSubmitHandler);
  dom.$indexBanner.on('submit', '#delete-account-form', deleteAccountSubmitHandler);

  dom.$indexBanner.on('click', '.start-button', startButtonClickHandler);
  dom.$indexBanner.on('click', '#back-button', backButtonClickHandler);
  dom.$indexBanner.on('click', '#skip-button', skipButtonClickHandler);

  dom.$indexBanner.on('submit', '#question-form', questionFormSubmitHandler);
  dom.$indexBanner.on('click', '#skip-submit-button', result.getResults);
  dom.$indexBanner.on('click', '.unique-button', uniqueButtonClickHandler);
  dom.$indexBanner.on('click', '.delete-answer-button', deleteAnswerButtonClickHandler);
  dom.$indexBanner.on('click', '.edit-answer-button', editAnswerButtonClickHandler);
  dom.$indexBanner.on('click', '.cancel-button', editCancelButtonClickHandler);
  dom.$indexBanner.on('submit', '.edit-answer-form', editAnswerFormSubmitHandler);

  dom.$dropdown1.on('click', 'input', function(e) {
    e.stopPropagation();
  });
  dom.$dropdown1.on('click', 'button', function(e) {
    e.stopPropagation();
  });
  dom.$nav.find('#login-signup').on("click", function(e) {
    e.preventDefault();
  });
  dom.$nav.find('#nav-mobile').on('click', function(e) {
    e.preventDefault();
  });

}

module.exports = eventHandlers;
