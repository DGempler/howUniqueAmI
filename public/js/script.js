$(function() {
  var $body = $('body');
  var $nav = $('nav');
  var $indexBanner = $('#index-banner');
  var $dropdownButton = $('.dropdown-button');
  var passwordCheck;

  $dropdownButton.dropdown();

  $(".dropdown-content").on('click', 'input', function(e) {
    e.stopPropagation();
  });

  $(".dropdown-content").on('click', 'button', function(e) {
    e.stopPropagation();
  });

  $('#dropdown1').on('click', '#signup-link', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var $form = $(this).parent().parent().find('#login-form');
    var $passwordConfirm = $('<div class="input-field"><input type="password" name="user[confirmPassword]" id="confirm-password" placeholder="Confirm Password" required/></div><br/>');
    $form.attr('method', "POST");
    $form.attr('action', '/signup');
    $form.attr('id', 'signup-form');
    $(this).remove();
    $passwordConfirm.insertBefore('#login-button');
    $form.find('#login-button').text('Sign up').attr('id', 'signup-button');
  });

  $('#dropdown1').on('submit', '#signup-form', function(e) {
    // e.stopPropagation();
    e.preventDefault();
    var $email = $('#email').val();
    var $password = $('#password').val();
    var $confirmPassword = $('#confirm-password').val();
    console.log($password);
    console.log($confirmPassword);
    if (passwordCheck) {
      var data = {user: {email: $email, password: $password}};
      $.ajax({
        data: data,
        dataType: 'json',
        url: '/signup',
        method: 'POST',
        success: function(data) {
          $('.dropdown-button').text('Menu');
        }
      });
    }
  });

  $('#dropdown1').on('keyup', '#password', function() {
    var $password = $('#password').val();
    var $confirmPassword = $('#confirm-password').val();
    passwordCheck = validatePassword($password, $confirmPassword);
  });
  $('#dropdown1').on('keyup', '#confirm-password', function() {
    var $password = $('#password').val();
    var $confirmPassword = $('#confirm-password').val();
    passwordCheck = validatePassword($password, $confirmPassword);
  });

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


  function getQuestion(number) {
    $.getJSON('/questions/' + number).done(function(data) {
      var question = createQuestion(data);
      $indexBanner.append(question);
    });
  }

  $indexBanner.on('click', '#start-button', function(e) {
    e.preventDefault();
    $indexBanner.find('.container').children().fadeOut();
    getQuestion(1);
  });

  $nav.find('#login-signup').on("click", function(e) {
    e.preventDefault();

  });

  $nav.find('#nav-mobile').on('click', function(e) {
    e.preventDefault();
  });

// $("#height-select").append($("<option></option>").val(1).html("One"));
// $("#weight-select").append($("<option></option>").val(1).html("One"));


});