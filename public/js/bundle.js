/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var script = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports) {

	var script = $(function() {

	  var totalUniqueResult = {1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1};
	  var qLinks = {1: "birthday", 2: "gender", 3: "race", 4: "place of birth", 5: "language",
	                6: "education", 7: "employment", 8: "income", 9: "tenure", 10: "house type",
	                11: "marital status"};

	  var $body = $('body');
	  var $nav = $('nav');
	  var $indexBanner = $('#index-banner');
	  var $dropdown1 = $('#dropdown1');
	  var $dropdownButton = $nav.find('.dropdown-button');
	  var $dropdownText = $dropdownButton.find('#dropdown-text');
	  var $questionLinks =$('#question-links');
	  var questionIndex;
	  var passwordCheck;

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
	            compareData(id, answer, lib.answerData[answer],
	                        lib.totalPop, "born", library[id].text);
	          }
	        });
	      });
	    }
	    else {
	      $.getJSON(url).done(function(data) {
	        var lib = library[id].dataKeys(data);
	        compareData(id, answer, lib.answerData[answer],
	                    lib.totalPop, library[id].type, library[id].text);
	      });
	    }
	  }

	  function compareData(id, answer, chosenTypePop, totalPop, type, text) {
	    var singleUniqueResult = chosenTypePop / totalPop;
	    totalUniqueResult[id] = singleUniqueResult;
	    var modAnswer = modifyAnswerGrammar(answer, type);
	    var $displayedResult = $('#qId' + id).find('.single-unique-result');
	    if ($displayedResult.length === 0) {
	      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">' +
	                            (singleUniqueResult * 100).toFixed(2) + text + modAnswer + '.</h5>');
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
	      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">Only ' +
	                            (singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' +
	                            answer + ' years old!</h5>');
	    }
	    else {
	      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' +
	                            answer + ' years old!');
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
	    $div.append("<h5 class='total-unique-result header col s12 light'>You are just like " +
	                "<span id='result-percent'>" + (multipliedResult * 100).toFixed(6) +
	                "</span>% of the US Population!</h5>");
	    $div.append("<h5 class='total-unique-result header col s12 light'>" +
	                "That means there are only <span id='result-num'>" + stringResult +
	                "</span> people in the U.S. JUST LIKE YOU!!!!</h5>");
	    $div.append("<h5 class='total-unique-result header col s12 light'>Like, LOL OMG " +
	                "<a>SHARE!</a></h5>");
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

	  function changeFormType(oldType, newType, oldText, newText) {
	    var $form = $dropdown1.find('#' + oldType + '-form');
	    $form.attr('id', newType + '-form');
	    $(this).remove();
	    $form.find('#' + oldType + '-button').text(newText).attr('id', newType + '-button');
	    $dropdown1.append('<li><a class="center" id="' + oldType + '-link" href="/' +
	                      oldType + '">'  + oldText + '</a></li>');
	    return $form;
	  }

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

	  function signupFormSubmitHandler(e) {
	    e.preventDefault();
	    var email = $dropdown1.find('#email').val();
	    var password = $dropdown1.find('#password').val();
	    var userData = {user: {email: email, password: password}};
	    if (passwordCheck) {
	      signUpUser.call(this, userData);
	    }
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

	  function loginFormSubmitHandler(e) {
	    e.preventDefault();
	    var $loginForm = $(this);
	    var email = $loginForm.find('#email').val();
	    var password = $loginForm.find('#password').val();
	    var userData = {user: {email: email, password: password}};
	    logInUser(userData, $loginForm);
	  }

	  function displayIndex(loggedIn) {
	    var html = indexScreen({loggedIn: loggedIn});
	    $indexBanner.html(html);
	    $questionLinks.empty();
	  }

	  function logOutUser() {
	    $.getJSON('/logout').done(function(data) {
	      $dropdownText.text('Log in');
	      var loginText = loginMenu();
	      $dropdown1.html(loginText);
	      displayIndex(false);
	    });
	  }

	  function displayUserAccount() {
	    var html = userAccount();
	    $indexBanner.html(html);
	    $questionLinks.empty();
	  }

	  function startQuestions() {
	    questionIndex = 1;
	    getNextQuestion();
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

	  function getUser() {
	    var $userEditDelete = $(this);
	    $.getJSON('/users').done(function(data) {
	      var html = editUserAccount(data);
	      $userEditDelete.after(html);
	      $userEditDelete.hide();
	    });
	  }

	  function userEditDeleteClickHandler(e) {
	    e.preventDefault();
	    $indexBanner.find('.edit-message').remove();
	    getUser.call(this);
	  }

	  function notifyNoChangesMade($editAccountForm) {
	    $editAccountForm.parent().remove();
	    $indexBanner.find('#user-edit-delete').show().after(
	      '<h5 class="edit-message header col s12 light">' +
	      'No changes have been made to your account.</h5><br/>');
	  }

	  function updateUser(userData, $editAccountForm) {
	    $.ajax({
	      data: userData,
	      dataType: 'json',
	      url: '/users',
	      method: 'PUT',
	      success: function(data) {
	        $editAccountForm.parent().remove();
	        $indexBanner.find('#user-edit-delete').show().after('<h5 class="edit-message header ' +
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

	  function deleteUser(userData, $deleteAccountForm) {
	    $.ajax({
	      data: userData,
	      dataType: 'json',
	      url: '/users',
	      method: "DELETE",
	      success: function(data) {
	        $deleteAccountForm.parent().remove();
	        $indexBanner.empty().after('<h5 class="delete-message center header col s12 light">' +
	                                    'Your account has been successfully deleted. ' +
	                                    'Please login to continue.</h5><br/>');
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
	  }

	  function deleteAccountSubmitHandler(e) {
	    e.preventDefault();
	    var $deleteAccountForm = $(this);
	    var password = $deleteAccountForm.find('#delete-password').val();
	    var userData = {password: password};
	    deleteUser(userData, $deleteAccountForm);
	  }

	  function submitAnswer(answerData, jumpToResults) {
	    $.ajax({
	      url: '/answers',
	      data: answerData,
	      dataType: 'json',
	      method: 'POST',
	      success: function(data) {
	        if (questionIndex >= 12 || jumpToResults) {
	          getResults();
	        } else {
	          getNextQuestion();
	        }
	      }
	    });
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
	      passwordCheck = validatePassword($password, $confirmPassword);
	    }
	  }

	  function confirmPasswordKeyupHandler() {
	    var $password = $('#password').val();
	    var $confirmPassword = $('#confirm-password').val();
	    passwordCheck = validatePassword($password, $confirmPassword);
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

	  function getAnswerAndSubmit($questionForm, getSomethingFunction, jumpToResults) {
	    var qID = $questionForm.attr('data-MongID');
	    var $input = $questionForm.find('input');
	    var answer = $input.val().trim();
	    if (answer !== "" && answer !== "Choose your option") {
	      var answerData = {qID: qID, answer: answer};
	      submitAnswer(answerData, jumpToResults);
	    } else {
	      getSomethingFunction();
	    }
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

	  function deleteAnswer(answerData, $answer, qId) {
	    $.ajax({
	      url:"/answers",
	      method: "DELETE",
	      dataType: 'json',
	      data: answerData,
	      success: function(data) {
	        $answer.find('.answer').text('blank').addClass('grey-text');
	        $answer.show();
	        totalUniqueResult[qId] = 1;
	        showTotalUniqueResult();
	      }
	    });
	  }

	  function deleteAnswerButtonClickHandler(e) {
	    e.preventDefault();
	    var $answer = $(this).parent();
	    var answerId = $(this).attr('data-deleteId');
	    var qId = $(this).attr('data-qID');
	    var answerData = {answerId: answerId};
	    deleteAnswer(answerData, $answer, qId);
	  }

	  function getQuestionAndCreateEditForm(qId, $answer) {
	    $.getJSON('/questions/' + qId).done(function(data) {
	      var html = editAnswerTemplate(data);
	      $answer.after(html);
	      var $select = $('select');
	      if ($select.length) {
	        $select.material_select();
	      }
	      $answer.hide();
	    });
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

	  function editAnswer(answerData, $questionForm) {
	    $.ajax({
	      url: '/answers',
	      data: answerData,
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

	  $('.button-collapse').sideNav();

	  $dropdownButton.dropdown({
	    constrain_width: false,
	    belowOrigin: true
	  });

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
	});

	module.exports = script;

/***/ }
/******/ ]);