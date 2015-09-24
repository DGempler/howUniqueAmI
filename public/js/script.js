$(function() {
  var $body = $('body');
  var $nav = $('nav');
  var $indexBanner = $('#index-banner');
  var passwordCheck;
  var $dropdown1 = $('#dropdown1');
  var $dropdownButton = $('.dropdown-button');
  var questionIndex = 1;

  // $('select').material_select();

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
    var $form = $dropdown1.find('#login-form');
    var $passwordConfirm = $('<div class="input-field"><input type="password" name="user[confirmPassword]" id="confirm-password" placeholder="Confirm Password" required/></div>');
    $form.attr('method', "POST");
    $form.attr('action', '/signup');
    $form.attr('id', 'signup-form');
    $(this).remove();
    $passwordConfirm.insertBefore('#login-button');
    $form.find('#login-button').text('Sign up').attr('id', 'signup-button');
    $dropdown1.append('<li><a id="login-link" href="/login">Log in instead</a></li>');
  });

  $dropdown1.on('click', '#login-link', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var $form = $dropdown1.find('#signup-form');
    $form.attr('method', "GET");
    $form.attr('action', '/login');
    $form.attr('id', 'login-form');
    $(this).remove();
    $form.find('#confirm-password').parent().remove();
    $form.find('#signup-button').text('Log in').attr('id', 'login-button');
    $dropdown1.append('<li><a id="signup-link" href="/signup">Sign Up</a></li>');
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
          var $loggedInMenu = $('<li class="logged-in-links"><a id="my-account" href="/users">My Profile</a></li>' +
                                '<li class="logged-in-links"><a id="logout" href="/logout">Logout</a></li>');
          $dropdown1.html($loggedInMenu);
        }
      });
    }
  });

  $dropdown1.on('submit', '#login-form', function(e) {
    e.preventDefault();
    // e.stopPropagation();
    var $loginForm = $(this);
    var $email = $loginForm.find('#email').val();
    var $password = $loginForm.find('#password').val();
    var data = {user: {email: $email, password: $password}};
    $.ajax({
      data: data,
      dataType: 'json',
      url: '/login',
      method: 'POST',
      success: function(data) {
        $dropdownButton.html('Menu<i class="material-icons right">arrow_drop_down</i>');
        $loginForm.trigger('click');
        var $loggedInMenu = $('<li class="logged-in-links"><a id="my-account" href="/users">My Profile</a></li>' +
                              '<li class="logged-in-links"><a id="logout" href="/logout">Logout</a></li>');
        $dropdown1.html($loggedInMenu);
      }
    });
  });


  $dropdown1.on('click', '.logged-in-links', function(e) {
    console.log(e);
    // e.stopPropagation();
    e.preventDefault();
    if ($(this).find('a').attr('id') === "logout") {
      $.getJSON('/logout').done(function(data) {
        $dropdownButton.html('Log in<i class="material-icons right">arrow_drop_down</i>');
        var html = loginMenu();
        $dropdown1.html(html);
      });
    }
    else if ($(this).find('a').attr('id') === "my-account") {
      var html = userAccount();
      $indexBanner.html(html);
    }
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

  $dropdown1.on('keyup', '#password', function() {
    var $confirmPassword = $('#confirm-password');
    if ($confirmPassword.length) {
      var $password = $('#password').val();
      $confirmPassword = $confirmPassword.val();
      passwordCheck = validatePassword($password, $confirmPassword);
    }
  });
  $dropdown1.on('keyup', '#confirm-password', function() {
    var $password = $('#password').val();
    var $confirmPassword = $('#confirm-password').val();
    passwordCheck = validatePassword($password, $confirmPassword);
  });

  $nav.on('click', '#logo', function(e) {
    e.preventDefault();
    var html = indexScreen();
    $indexBanner.html(html);
  });



  $nav.find('#login-signup').on("click", function(e) {
    e.preventDefault();

  });

  $nav.find('#nav-mobile').on('click', function(e) {
    e.preventDefault();
  });

  function getQuestion(number) {
    $.getJSON('/questions/' + number).done(function(data) {
      var question = createQuestion(data);
      $indexBanner.append(question);
      var $select = $('select');
      if ($select.length) {
        $select.material_select();
      }
      if (questionIndex === 21) {
        $indexBanner.find('#next-button').text('Submit');
        $indexBanner.find('#skip-button').text('Skip & Submit').attr('id', 'skip-submit-button');
      }
    });
  }

  function getNextQuestion(e) {
    e.preventDefault();
    $indexBanner.html('');
    getQuestion(questionIndex);
    questionIndex++;
  }

  $indexBanner.on('click', '#start-button', getNextQuestion);

  $indexBanner.on('click', '#skip-button', getNextQuestion);

  $indexBanner.on('submit', '#question-form', function(e) {
    e.preventDefault();
    var $questionForm = $(this);
    var qID = $(this).attr('data-qID');
    var $input = $(this).find('input');
    var answerType = $input.attr('id');
    var answer = $input.val().trim().toLowerCase();
    console.log(answer);
    if (answer === "" || answer === "choose your option") {
      $questionForm.remove();
      getQuestion(questionIndex);
      questionIndex++;
    }
    else {
      var data = {qID: qID, answer: answer};
      $.ajax({
        url: '/answers',
        data: data,
        dataType: 'json',
        method: 'POST',
        success: function(data) {
          $questionForm.remove();
          if (questionIndex < 21) {
            getQuestion(questionIndex);
            questionIndex++;
          }
          else {
            $.getJSON('/answers').done(function(data) {
              console.log(data);
            });
          }
        }
      });
    }
  });

  $indexBanner.on('click', '#skip-submit-button', function(e) {
    e.preventDefault();
    $.getJSON('/answers').done(function(data) {
      console.log(data);
    });
  });

// $("#height-select").append($("<option></option>").val(1).html("One"));
// $("#weight-select").append($("<option></option>").val(1).html("One"));


});