$(function() {

  var totalUniqueResult = {1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1};
  var qLinks = {1: "birthday", 2: "gender", 3: "race", 4: "place of birth", 5: "language", 6: "education", 7: "employment", 8: "income", 9: "tenure", 10: "house type", 11: "marital status"};

  var $body = $('body');
  var $nav = $('nav');
  var $indexBanner = $('#index-banner');
  var $dropdown1 = $('#dropdown1');
  var $dropdownButton = $nav.find('.dropdown-button');
  var $dropdownText = $dropdownButton.find('#dropdown-text');
  var $questionLinks =$('#question-links');
  var questionIndex;
  var passwordCheck;

  // $('select').material_select();

  $dropdownButton.dropdown({
    constrain_width: false,
    belowOrigin: true
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

  function createQLinks() {
    var links = questionLinks({qLinks: qLinks});
    $questionLinks.append(links);
  }

  function configureQuestionsView() {
    var $select = $('select');
    if ($('.qLinks').length === 0) {
      createQLinks();
    }
    if (questionIndex === 2) {
      $indexBanner.find('#back-button').hide();
    }
    if ($select.length) {
      $select.material_select();
    }
    if (questionIndex === 12) {
      $indexBanner.find('#next-button').text('Submit');
      $indexBanner.find('#skip-button').text('Skip & Submit').attr('id', 'skip-submit-button');
    }
  }

  function getQuestion(number) {
    $.getJSON('/questions/' + number).done(function(questionData) {
      var question = createQuestion(questionData);
      $indexBanner.empty();
      $indexBanner.append(question);
      configureQuestionsView();
    })
    .fail(function() {
      $nav.find('.dropdown-button').click();
    });
  }

  function getNextQuestion() {
    getQuestion(questionIndex);
    questionIndex++;
  }

  function configureResultsView(answerData) {
    if (answerData.length === 0) {
      showTotalUniqueResult("none");
    }
    else {
      processAnswers(answerData);
      var html = displayResults({array: answerData});
      $indexBanner.append(html);
    }
  }

  function getResults(e) {
    if (e) {
      e.preventDefault();
    }
    $.getJSON('/answers').done(function(answerData) {
      $indexBanner.empty();
      $questionLinks.empty();
      configureResultsView(answerData);
    });
  }

  function processAnswers(answerArray) {
    answerArray.forEach(function(answerObject) {
      var qId = Number(answerObject.question.qID);
      var userAnswer = answerObject.answer;
      if (qId === 1) {
        userAnswer = getDateObject(userAnswer);
      }
      var apiURL = returnAPI(qId, userAnswer);
      makeAPIcall(apiURL, qId, userAnswer);
    });
  }

  function getDateObject(bDay) {
    var jsBDay = new Date(bDay.slice(0,4), Number(bDay.slice(5, 7)) -1, bDay.slice(8,10));
    var today = new Date();
    var dateObj = {};
    dateObj.year = today.getFullYear();
    dateObj.dd = today.getDate();
    dateObj.mm = today.getMonth()+1;
    dateObj.age = calculateAge(jsBDay);
    return dateObj;
  }

  function calculateAge(birthday) {
    var ageDifferenceMilliseconds = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifferenceMilliseconds);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  function returnAPI(qId, answer) {
    if (qId === 1) {
      var url = library[qId].url;
      return [url[0] + answer.year + url[1] + answer.age + url[2],
              url[3] + answer.year + url[4] + answer.mm + url[5] + answer.dd + url[6]];
    } else {
      return library[qId].url;
    }
  }

  function makeAPIcall(url, id, answer) {
    if (id === 1 || id ===  4) {
      $.getJSON(url[0]).done(function(data1) {
        $.getJSON(url[1]).done(function(data2) {
          if (id === 1) {
            compareUserAgePopToTotalPop(data1, data2, id, answer.age);
          }
          else {
            var lib = library[id].dataKeys(data1, data2);
            compareData(id, answer, lib.answerData[answer], lib.totalPop, "born", library[id].text);
          }
        });
      });
    }
    else {
      $.getJSON(url).done(function(data) {
        var lib = library[id].dataKeys(data);
        compareData(id, answer, lib.answerData[answer], lib.totalPop, library[id].type, library[id].text);
      });
    }
  }

  function compareData(id, answer, chosenTypePop, totalPop, type, text) {
    var singleUniqueResult = chosenTypePop / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    var modAnswer = modifyAnswerGrammar(answer, type);
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">' + (singleUniqueResult * 100).toFixed(2) + text + modAnswer + '.</h5>');
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + text + modAnswer + '.');
    }
    showTotalUniqueResult();
  }

  function compareUserAgePopToTotalPop(data1, data2, id, answer) {
    var userAgePop = data1[0].total;
    var totalPop = data2.total_population.population;
    var singleUniqueResult = userAgePop / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">Only ' + (singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' + answer + ' years old!</h5>');
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' + answer + ' years old!');
    }
    showTotalUniqueResult();
  }

  function modifyAnswerGrammar(answer, type) {
    if (type === "employment") {
      if (answer !== "Active Duty Military") {
        return answer[0].toLowerCase() + answer.slice(1);
      }
      else {
        return answer;
      }
    }
    else if (type === "tenure") {
      return answer[0].toLowerCase() + answer.slice(1);
    }
    else if (type === "gender" || type === "marital") {
      return answer.toLowerCase();
    }

    switch(answer) {
      case "Two or more races":
        return answer.toLowerCase();
      case "The United States":
        return answer[0].toLowerCase() + answer.slice(1);
      case "Other North America":
        return "another part of North America";
      case "Other Indo-European":
        return "another Indo-European language";
      case "Other":
        return "another language";
      case 'Less than $25,000':
        return answer[0].toLowerCase() + answer.slice(1);
      default:
        return answer;
    }
  }

  function multiplyResult() {
    var multipliedResult = 1;
    for (var qID in totalUniqueResult) {
      multipliedResult *= totalUniqueResult[qID];
    }
    return multipliedResult;
  }

  function addTotalUniqueResultToDOM(multipliedResult, stringResult, numAnswers) {
    var $div = $('<div id="result-div" class="row center"></div');
    $indexBanner.append($div);
    $div.append("<h5 class='total-unique-result header col s12 light'>You are just like <span id='result-percent'>" + (multipliedResult * 100).toFixed(6) + "</span>% of the US Population!</h5>");
    $div.append("<h5 class='total-unique-result header col s12 light'>That means there are only <span id='result-num'>" + stringResult + "</span> people in the U.S. JUST LIKE YOU!!!!</h5>");
    $div.append("<h5 class='total-unique-result header col s12 light'>Like, LOL OMG <a>SHARE!</a></h5>");
    if (numAnswers === "none") {
      var html = noQuestionsAnswered();
      $indexBanner.append(html);
    }
  }

  function updateTotalUniqueResultOnDom(multipliedResult, stringResult) {
    $resultDiv = $indexBanner.find('#result-div');
    $resultDiv.find('#result-percent').text((multipliedResult * 100).toFixed(6));
    $resultDiv.find('#result-num').text(stringResult);
  }

  function showTotalUniqueResult(numAnswers) {
    var multipliedResult = multiplyResult();
    $.getJSON(library.totalPop.url).done(function(data) {
      var totalPop = data.data['01000US'].B01001.estimate.B01001001;
      var numResult = (multipliedResult * totalPop);
      var stringResult = numResult.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      if ($('#result-div').length === 0) {
        addTotalUniqueResultToDOM(multipliedResult, stringResult, numAnswers);
      }
      else {
        updateTotalUniqueResultOnDom(multipliedResult, stringResult);
      }
    });
  }


  //Event Handlers
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
    $dropdown1.append('<li><a class="center" id="login-link" href="/login">Log in instead</a></li>');
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
    $dropdown1.append('<li><a class="center" id="signup-link" href="/signup">Sign Up</a></li>');
  });

  $dropdown1.on('submit', '#signup-form', function(e) {
    // e.stopPropagation();
    e.preventDefault();
    var email = $dropdown1.find('#email').val();
    var password = $dropdown1.find('#password').val();
    var $signupForm = $(this);
    if (passwordCheck) {
      var data = {user: {email: email, password: password}};
      $.ajax({
        data: data,
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
  });

  $dropdown1.on('submit', '#login-form', function(e) {
    e.preventDefault();
    // e.stopPropagation();
    var $loginForm = $(this);
    var email = $loginForm.find('#email').val();
    var password = $loginForm.find('#password').val();
    var data = {user: {email: email, password: password}};
    $.ajax({
      data: data,
      dataType: 'json',
      url: '/login',
      method: 'POST',
      success: function(data) {
        $dropdownText.text('Menu');
        $loginForm.trigger('click');
        var $loggedInMenu = loggedInMenuHTML();
        $dropdown1.html($loggedInMenu);
        var html = userAccount();
        $indexBanner.html(html);
        $questionLinks.empty();
      },
      error: function(xhr, text, error) {
          $dropdown1.find('#password').val('');
          Materialize.toast('Invalid Email or Password', 2000);
      }
    });
  });

  $dropdown1.on('click', '.logged-in-links', function(e) {
    // e.stopPropagation();
    e.preventDefault();
    if ($(this).find('a').attr('id') === "logout") {
      $.getJSON('/logout').done(function(data) {
        $dropdownText.text('Log in');
        var loginText = loginMenu();
        $dropdown1.html(loginText);
        var html = indexScreen({loggedIn: false});
        $indexBanner.html(html);
        $questionLinks.empty();
      });
    }
    else if ($(this).find('a').attr('id') === "my-account") {
      var html = userAccount();
      $indexBanner.html(html);
      $questionLinks.empty();
    }
    else if ($(this).find('a').hasClass('start-button')) {
      questionIndex = 1;
      getNextQuestion();
    }
    else if ($(this).find('a').hasClass('unique-button')) {
      $indexBanner.empty();
      $questionLinks.empty();
      getResults();
    }
  });

  $indexBanner.on('click', '#user-edit-delete', function(e) {
    e.preventDefault();
    var $userEditDelete = $(this);
    $indexBanner.find('.edit-message').remove();
    // $userAccount = $(this).parent().parent();
    $.getJSON('/users').done(function(data) {
      var html = editUserAccount(data);
      $userEditDelete.after(html);
      $userEditDelete.hide();
    });
  });

  $indexBanner.on('submit', '#edit-account-form', function(e) {
    e.preventDefault();
    var $editAccountForm = $(this);
    var currentEmail = $editAccountForm.find('#current-email').val();
    var email = $editAccountForm.find('#email').val();
    var currentPassword = $editAccountForm.find('#current-password').val();
    var password = $editAccountForm.find('#password').val();
    if (currentEmail === email && password === "") {
      $editAccountForm.parent().remove();
      $indexBanner.find('#user-edit-delete').show().after('<h5 class="edit-message header col s12 light">No changes have been made to your account.</h5><br/>');
    }
    else {
      if (currentEmail === email) {
        email = 0;
      }
      if (password === "") {
        password = 0;
      }
      var data = {current: {email: currentEmail, password: currentPassword}, upcoming: {email: email, password: password}};
      $.ajax({
        data: data,
        dataType: 'json',
        url: '/users',
        method: 'PUT',
        success: function(data) {
          $editAccountForm.parent().remove();
          $indexBanner.find('#user-edit-delete').show().after('<h5 class="edit-message header col s12 light">Your account has been successfully updated.</h5><br/>');
        },
        error: function(err) {
          console.log(err);
          if (err.status === 401) {
            Materialize.toast('Invalid Password', 2000);
          }
          if (err.status === 409) {
            Materialize.toast('This user email already exists', 2000);
          }
        }
      });
    }
  });

  $indexBanner.on('submit', '#delete-account-form', function(e) {
    e.preventDefault();
    var $deleteAccountForm = $(this);
    var password = $deleteAccountForm.find('#delete-password').val();
    var data = {password: password};
    $.ajax({
      data: data,
      dataType: 'json',
      url: '/users',
      method: "DELETE",
      success: function(data) {
        $deleteAccountForm.parent().remove();
        $indexBanner.empty().after('<h5 class="delete-message center header col s12 light">Your account has been successfully deleted. Please login to continue.</h5><br/>');
        $dropdownText.text('Log in');
        var html = loginMenu();
        $dropdown1.html(html);
      },
      error: function(err) {
        if (err.status === 401) {
          Materialize.toast('Invalid Password', 2000);
        }
      }
    });
  });

  $questionLinks.on('click', '.qLinks', function(e) {
    e.preventDefault();
    questionIndex = $(this).attr('data-qId');
    var $questionForm = $('#question-form');
    var qID = $questionForm.attr('data-MongID');
    var $input = $questionForm.find('input');
    var answer = $input.val().trim();
    if (answer !== "" && answer !== "Choose your option") {
      var data = {qID: qID, answer: answer};
      $.ajax({
        url: '/answers',
        data: data,
        dataType: 'json',
        method: 'POST',
        success: function(data) {
          getNextQuestion();
        }
      });
    }
    else {
      getNextQuestion();
    }
  });

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

  $indexBanner.on('keyup', '#password', function() {
    var $confirmPassword = $('#confirm-password');
    if ($confirmPassword.length) {
      var $password = $('#password').val();
      $confirmPassword = $confirmPassword.val();
      passwordCheck = validatePassword($password, $confirmPassword);
    }
  });

  $indexBanner.on('keyup', '#confirm-password', function() {
    var $password = $('#password').val();
    var $confirmPassword = $('#confirm-password').val();
    passwordCheck = validatePassword($password, $confirmPassword);
  });

  $nav.on('click', '#logo', function(e) {
    e.preventDefault();
    var html = indexScreen({loggedIn: false});
    $indexBanner.html(html);
    $questionLinks.empty();
  });

  $nav.find('#login-signup').on("click", function(e) {
    e.preventDefault();
  });

  $nav.find('#nav-mobile').on('click', function(e) {
    e.preventDefault();
  });

  $indexBanner.on('click', '.start-button', function(e) {
    e.preventDefault();
    questionIndex = 1;
    getNextQuestion();
  });

  $indexBanner.on('click', '#back-button', function(e) {
    e.preventDefault();
    questionIndex -= 2;
    getNextQuestion();
  });

  $indexBanner.on('click', '#skip-button', function(e) {
    e.preventDefault();
    getNextQuestion();
  });

  $indexBanner.on('submit', '#question-form', function(e) {
    e.preventDefault();
    var $questionForm = $(this);
    var qID = $questionForm.attr('data-MongID');
    var $input = $questionForm.find('input');
    var answer = $input.val().trim();
    //check b-day for age HERE
    if (answer === "" || answer === "Choose your option") {
      $questionForm.remove();
      if (questionIndex < 12) {
        getQuestion(questionIndex);
        questionIndex++;
      }
      else {
        getResults();
      }
    }
    else {
      var data = {qID: qID, answer: answer};
      $.ajax({
        url: '/answers',
        data: data,
        dataType: 'json',
        method: 'POST',
        success: function(data) {
          if (questionIndex < 12) {
            getQuestion(questionIndex);
            questionIndex++;
          }
          else {
            getResults();
          }
        }
      });
    }
  });

  //remove skip submit button entirely?
  $indexBanner.on('click', '#skip-submit-button', getResults);

  $indexBanner.on('click', '.unique-button', function(e) {
    e.preventDefault();
    var $questionForm = $('#question-form');
    if ($questionForm.length !== 0) {
      var qID = $questionForm.attr('data-MongID');
      var $input = $questionForm.find('input');
      var answer = $input.val().trim();
      if (answer !== "" && answer !== "Choose your option") {
        var data = {qID: qID, answer: answer};
        $.ajax({
          url: '/answers',
          data: data,
          dataType: 'json',
          method: 'POST',
          success: function(data) {
            getResults();
          }
        });
      }
      else {
        getResults();
      }
    }
    else {
      getResults();
    }
  });

  $indexBanner.on('click', '.delete-answer-button', function(e) {
    e.preventDefault();
    var $answer = $(this).parent();
    var answerId = $(this).attr('data-deleteId');
    var qId = $(this).attr('data-qID');
    var data = {answerId: answerId};
    $.ajax({
      url:"/answers",
      method: "DELETE",
      dataType: 'json',
      data: data,
      success: function(data) {
        $answer.find('.answer').text('blank').addClass('grey-text');
        $answer.show();
        totalUniqueResult[qId] = 1;
        showTotalUniqueResult();
      }
    });
  });

  $indexBanner.on('click', '.edit-answer-button', function(e) {
    e.preventDefault();
    var $answer = $(this).parent();
    var qId = Number($(this).attr('data-qId'));
    $.getJSON('/questions/' + qId).done(function(data) {
      var html = editAnswer(data);
      $answer.after(html);
      var $select = $('select');
      if ($select.length) {
        $select.material_select();
      }
      $answer.hide();
    });
  });

  $indexBanner.on('click', '.cancel-button', function(e) {
    e.preventDefault();
    var $questionForm = $(this).parent();
    $questionForm.prev().show();
    $questionForm.remove();
  });

  $indexBanner.on('submit', '.edit-answer-form', function(e) {
    e.preventDefault();
    var $questionForm = $(this);
    var mongId = $questionForm.attr('data-qMongId');
    var $input = $questionForm.find('input');
    var answer = $input.val().trim();
    if (answer === "" || answer === "Choose your option") {
      $questionForm.prev().show();
      $questionForm.remove();
    }
    else {
      var data = {qID: mongId, answer: answer};
      $.ajax({
        url: '/answers',
        data: data,
        dataType: 'json',
        method: 'PUT',
        success: function(data) {
          $questionForm.prev().find('.answer').text(data.answer).removeClass('grey-text');
          var qId = Number($questionForm.prev().attr('data-qId'));
          if (qId === 1) {
            data.answer = getDateObject(data.answer);
          }
          var apiURL = returnAPI(qId, data.answer);
          makeAPIcall(apiURL, qId, data.answer);
          $questionForm.prev().show();
          $questionForm.remove();
          }
      });
    }
  });
});
