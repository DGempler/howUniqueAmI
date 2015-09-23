$(function() {
  var $body = $('body');
  var $nav = $('nav');
  var $indexBanner = $('#index-banner');
  var passwordCheck;
  var $dropdown1 = $('#dropdown1');
  var $dropdownButton = $('.dropdown-button');

  // $dropdownButton.dropdown();

  $dropdown1.on('click', 'input', function(e) {
    e.stopPropagation();
  });

  $dropdown1.on('click', 'button', function(e) {
    e.stopPropagation();
  });

  $dropdown1.on('click', '#signup-link', function(e) {
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

  $dropdown1.on('submit', '#signup-form', function(e) {
    // e.stopPropagation();
    e.preventDefault();
    var $email = $('#email').val();
    var $password = $('#password').val();
    var $confirmPassword = $('#confirm-password').val();
    var $signupForm = $(this);
    if (passwordCheck) {
      var data = {user: {email: $email, password: $password}};
      $.ajax({
        data: data,
        dataType: 'json',
        url: '/signup',
        method: 'POST',
        success: function(data) {
          $dropdownButton.html('Menu<i class="material-icons right">arrow_drop_down</i>');
          $signupForm.trigger('click');
          var $loggedInMenu = $('<li class="logged-in-links"><a id="my-account" href="/users"/>My Profile</a></li>' +
                                '<li class="logged-in-links"><a id="logout" href="/logout"/>Logout</a></li>');
          $dropdown1.html($loggedInMenu);
        }
      });
    }
  });

  $dropdown1.on('click', '.logged-in-links', function(e) {
    console.log(e);
    e.preventDefault();
    console.log('logging out!');
    if ($(this).find('a').attr('id') === "logout") {
      $.getJSON('/logout').done(function(data) {
        console.log(data);
        $dropdownButton.html('Log in<i class="material-icons right">arrow_drop_down</i>');
        var html = loginMenu();
        $dropdown1.html(html);
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