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

	var dom = __webpack_require__(1);
	var initEventHandlers = __webpack_require__(2);

	$('.button-collapse').sideNav();

	initEventHandlers();


/***/ },
/* 1 */
/***/ function(module, exports) {

	var dom = {
	  $dropdown1: $('#dropdown1'),
	  $nav: $('nav'),
	  $indexBanner: $('#index-banner'),
	  $questionLinks: $('#question-links'),
	  addTotalUniqueResultToDOM: addTotalUniqueResultToDOM,
	  changeFormType: changeFormType,
	  createQLinks: createQLinks,
	  configureQuestionsView: configureQuestionsView,
	  displayIndex: displayIndex,
	  displayUserAccount: displayUserAccount,
	  notifyNoChangesMade: notifyNoChangesMade,
	  questionIndex: undefined,
	  updateTotalUniqueResultOnDom: updateTotalUniqueResultOnDom
	};

	dom.$dropdownButton = dom.$nav.find('.dropdown-button');
	dom.$dropdownText = dom.$dropdownButton.find('#dropdown-text');

	function addTotalUniqueResultToDOM(multipliedResult, stringResult, numAnswers) {
	  var $div = $('<div id="result-div" class="row center"></div');
	  dom.$indexBanner.append($div);
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
	    dom.$indexBanner.append(html);
	  }
	}

	function changeFormType(oldType, newType, oldText, newText) {
	  var $form = dom.$dropdown1.find('#' + oldType + '-form');
	  $form.attr('id', newType + '-form');
	  $(this).remove();
	  $form.find('#' + oldType + '-button').text(newText).attr('id', newType + '-button');
	  dom.$dropdown1.append('<li><a class="center" id="' + oldType + '-link" href="/' +
	                    oldType + '">'  + oldText + '</a></li>');
	  return $form;
	}

	function configureQuestionsView() {
	  var $select = $('select');
	  if ($('.qLinks').length === 0) {
	    createQLinks();
	  }
	  if (dom.questionIndex === 2) {
	    dom.$indexBanner.find('#back-button').hide();
	  }
	  if ($select.length) {
	    $select.material_select();
	  }
	  if (dom.questionIndex === 12) {
	    dom.$indexBanner.find('#next-button').text('Submit');
	    dom.$indexBanner.find('#skip-button').text('Skip & Submit').attr('id', 'skip-submit-button');
	  }
	}

	function displayIndex(loggedIn) {
	  var html = indexScreen({loggedIn: loggedIn});
	  dom.$indexBanner.html(html);
	  dom.$questionLinks.empty();
	}

	function displayUserAccount() {
	  var html = userAccount();
	  dom.$indexBanner.html(html);
	  dom.$questionLinks.empty();
	}

	function notifyNoChangesMade($editAccountForm) {
	  $editAccountForm.parent().remove();
	  dom.$indexBanner.find('#user-edit-delete').show().after(
	      '<h5 class="edit-message header col s12 light">' +
	      'No changes have been made to your account.</h5><br/>');
	}

	function updateTotalUniqueResultOnDom(multipliedResult, stringResult) {
	  $resultDiv = dom.$indexBanner.find('#result-div');
	  $resultDiv.find('#result-percent').text((multipliedResult * 100).toFixed(6));
	  $resultDiv.find('#result-num').text(stringResult);
	}

	///////////////////////////////
	// PRIVATE METHODS & VARIABLES
	//////////////////////////////

	function createQLinks() {
	  var links = questionLinks({qLinks: qLinks});
	  dom.$questionLinks.append(links);
	}

	var qLinks = {1: "birthday", 2: "gender", 3: "race", 4: "place of birth", 5: "language",
	              6: "education", 7: "employment", 8: "income", 9: "tenure", 10: "house type",
	              11: "marital status"};

	module.exports = dom;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var auth = __webpack_require__(3);
	var dom = __webpack_require__(1);
	var qa = __webpack_require__(4);
	var result = __webpack_require__(6);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var dom = __webpack_require__(1);

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
	      dom.$dropdownText.text('Log in');
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
	      dom.$dropdownText.text('Menu');
	      $loginForm.trigger('click');
	      var $loggedInMenu = loggedInMenuHTML();
	      dom.$dropdown1.html($loggedInMenu);
	      dom.questionIndex = 1;
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
	    dom.$dropdownText.text('Log in');
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
	      dom.$dropdownText.text('Menu');
	      $signupForm.trigger('click');
	      var $loggedInMenu = loggedInMenuHTML();
	      dom.$dropdown1.html($loggedInMenu);
	      dom.questionIndex = 1;
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var dom = __webpack_require__(1);
	var library = __webpack_require__(5);
	var result = __webpack_require__(6);
	var utils = __webpack_require__(7);

	var questionAnswer = {
	  deleteAnswer: deleteAnswer,
	  editAnswer: editAnswer,
	  getAnswerAndSubmit: getAnswerAndSubmit,
	  getQuestionAndCreateEditForm: getQuestionAndCreateEditForm,
	  getNextQuestion: getNextQuestion,
	  startQuestions: startQuestions
	};

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
	      result.showTotalUniqueResult();
	    }
	  });
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
	        data.answer = utils.getDateObject(data.answer);
	      }
	      var apiURL = utils.returnAPI(qId, data.answer);
	      makeAPIcall(apiURL, qId, data.answer);
	      $questionForm.prev().show();
	      $questionForm.remove();
	      }
	  });
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

	function getNextQuestion() {
	  getQuestion(dom.questionIndex);
	  dom.questionIndex++;
	}

	function startQuestions() {
	  dom.questionIndex = 1;
	  getNextQuestion();
	}

	function submitAnswer(answerData, jumpToResults) {
	  $.ajax({
	    url: '/answers',
	    data: answerData,
	    dataType: 'json',
	    method: 'POST',
	    success: function(data) {
	      if (dom.questionIndex >= 12 || jumpToResults) {
	        result.getResults();
	      } else {
	        getNextQuestion();
	      }
	    }
	  });
	}

	//////////////////
	// PRIVATE METHODS
	//////////////////

	function getQuestion(number) {
	  $.getJSON('/questions/' + number).done(function(questionData) {
	    var question = createQuestion(questionData);
	    dom.$indexBanner.empty();
	    dom.$indexBanner.append(question);
	    configureQuestionsView();
	  })
	  .fail(function() {
	    dom.$nav.find('.dropdown-button').click();
	  });
	}

	function makeAPIcall(url, id, answer) {
	  if (id === 1 || id ===  4) {
	    $.getJSON(url[0]).done(function(data1) {
	      $.getJSON(url[1]).done(function(data2) {
	        if (id === 1) {
	          result.compareUserAgePopToTotalPop(data1, data2, id, answer.age);
	        }
	        else {
	          var lib = library[id].dataKeys(data1, data2);
	          result.compareData(id, answer, lib.answerData[answer],
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

	module.exports = questionAnswer;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var library = {
	  totalPop: {
	    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=01000US',
	  },
	  1: {
	    url: ['http://api.population.io:80/1.0/population/', '/United%20States/', '/',
	              'http://api.population.io:80/1.0/population/United%20States/','-','-','/'],
	  },
	  2: {
	    dataKeys: function(data) {
	      var dataObject = {
	        totalPop: data.data['01000US'].B01001.estimate.B01001001,
	        answerData: {
	          'Male': data.data['01000US'].B01001.estimate.B01001002,
	          'Female': data.data['01000US'].B01001.estimate.B01001026
	        },
	      };
	      return dataObject;
	    },
	    text: '% of the US Population is ',
	    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=01000US',
	    type: 'gender'
	  },
	  3: {
	    dataKeys: function(data) {
	      var dataObject = {
	        totalPop: data.data['01000US'].B03002.estimate.B03002001,
	        answerData: {
	          'American Indian or Alaska Native': data.data['01000US'].B03002.estimate.B03002005,
	          'Asian': data.data['01000US'].B03002.estimate.B03002006,
	          'Black or African American': data.data['01000US'].B03002.estimate.B03002004,
	          'Hispanic': data.data['01000US'].B03002.estimate.B03002012,
	          'Native Hawaiian or Other Pacific Islander': data.data['01000US'].B03002.estimate.B03002007,
	          'White': data.data['01000US'].B03002.estimate.B03002003,
	          'Other': data.data['01000US'].B03002.estimate.B03002008,
	          'Two or more races': data.data['01000US'].B03002.estimate.B03002009,
	        },
	      };
	      return dataObject;
	    },
	    text: '% of the US Population is ',
	    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B03002&geo_ids=01000US',
	    type: 'race'
	  },
	  4: {
	    dataKeys: function(data1, data2) {
	      var datum = data1.data['01000US'].B05006.estimate;
	      var totalPop = data2.data['01000US'].B01001.estimate.B01001001;
	      var dataObject = {
	        totalPop: data2.data['01000US'].B01001.estimate.B01001001,
	        answerData: {
	          'The United States': totalPop - datum.B05006001,
	          'Europe': datum.B05006002,
	          'Asia': datum.B05006047,
	          'Africa': datum.B05006091,
	          'Oceania': datum.B05006116,
	          'Latin America': datum.B05006123,
	          'Other North America': datum.B05006159,
	        },
	      };
	      return dataObject;
	    },
	    text: '% of the US Population is from ',
	    url: ['http://api.censusreporter.org/1.0/data/show/latest?table_ids=B05006&geo_ids=01000US',
	            'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=01000US'],
	    type: 'born',
	  },
	  5: {
	    dataKeys: function(data) {
	      var dataObject = {
	        totalPop: data.data['01000US'].B16007.estimate.B16007001,
	        answerData: {
	          'English only': data.data['01000US'].B16007.estimate.B16007003 + data.data['01000US'].B16007.estimate.B16007009 + data.data['01000US'].B16007.estimate.B16007015,
	          'Spanish': data.data['01000US'].B16007.estimate.B16007004 + data.data['01000US'].B16007.estimate.B16007010 + data.data['01000US'].B16007.estimate.B16007016,
	          'Other Indo-European': data.data['01000US'].B16007.estimate.B16007005 + data.data['01000US'].B16007.estimate.B16007011 + data.data['01000US'].B16007.estimate.B16007017,
	          'Asian/Pacific Islander': data.data['01000US'].B16007.estimate.B16007006 + data.data['01000US'].B16007.estimate.B16007012 + data.data['01000US'].B16007.estimate.B16007018,
	          'Other': data.data['01000US'].B16007.estimate.B16007007 + data.data['01000US'].B16007.estimate.B16007013 + data.data['01000US'].B16007.estimate.B16007019,
	        },
	      };
	      return dataObject;
	    },
	    text: '% of the US Population speaks ',
	    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B16007&geo_ids=01000US',
	    type: 'language'
	  },
	  6: {
	    dataKeys: function(data) {
	      var datum = data.data['01000US'].B15002.estimate;
	      var dataObject = {
	        totalPop: datum.B15002002 + datum.B15002019,
	        answerData: {
	          'None thru 8th grade': datum.B15002003 + datum.B15002004 + datum.B15002005 + datum.B15002006 + datum.B15002020 + datum.B15002021 + datum.B15002022 + datum.B15002023,
	          '9th - 12th grade, no diploma': datum.B15002007 + datum.B15002008 + datum.B15002009 + datum.B15002010 + datum.B15002024 + datum.B15002025 + datum.B15002026 + datum.B15002027,
	          'High school graduate (or equivalent)': datum.B15002011 + datum.B15002028,
	          'Some college, no degree': datum.B15002012 + datum.B15002013 + datum.B15002029 + datum.B15002030,
	          "Associate's degree": datum.B15002014 + datum.B15002031,
	          "Bachelor's degree": datum.B15002015 + datum.B15002032,
	          "Master's degree": datum.B15002016 + datum.B15002033,
	          'Professional school degree': datum.B15002017 + datum.B15002034,
	          'Doctorate degree': datum.B15002018 + datum.B15002035,
	        },
	      };
	      return dataObject;
	    },
	    text: "% of the US Population (over 25 years old) has an education level of: ",
	    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B15002&geo_ids=01000US',
	    type: 'education'
	  },
	  7: {
	    dataKeys: function(data) {
	      var datum = data.data['01000US'].B23025.estimate;
	      var dataObject = {
	        totalPop: datum.B23025001,
	        answerData: {
	          'Employed': datum.B23025004,
	          'Unemployed': datum.B23025005,
	          'Active Duty Military': datum.B23025006,
	          'Not in the labor force': datum.B23025007,
	        },
	      };
	      return dataObject;
	    },
	    text: "% of the US Population (over 16 years old) is ",
	    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B23025&geo_ids=01000US',
	    type: 'employment'
	  },
	  8: {
	    dataKeys: function(data) {
	      var datum = data.data['01000US'].B19001.estimate;
	      var dataObject = {
	        totalPop: datum.B19001001,
	        answerData: {
	          'Less than $25,000': datum.B19001002 + datum.B19001003 + datum.B19001004 + datum.B19001005,
	          '$25,000 to $49,999': datum.B19001006 + datum.B19001007 + datum.B19001008 + datum.B19001009 + datum.B19001010,
	          '$50,000 to $74,999': datum.B19001011 + datum.B19001012,
	          '$75,000 to $99,999': datum.B19001013,
	          '$100,000 to $124,999': datum.B19001014,
	          '$125,000 to $149,999': datum.B19001015,
	          '$150,000 to $199,999': datum.B19001016,
	          '$200,000 or more': datum.B19001017,
	        },
	      };
	      return dataObject;
	    },
	    text: "% of the US Population's annual household income is ",
	    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B19001&geo_ids=01000US',
	    type: 'income'
	  },
	  9: {
	    dataKeys: function(data) {
	      var datum = data.data['01000US'].B25003.estimate;
	      var dataObject = {
	        totalPop: datum.B25003001,
	        answerData: {
	          'Own': datum.B25003002,
	          'Rent': datum.B25003003,
	        },
	      };
	     return dataObject;
	    },
	    text: "% of the US Population ",
	    url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B25003&geo_ids=01000US',
	    type: 'tenure'
	  },
	  10: {
	    dataKeys: function(data) {
	    var datum = data.data['01000US'].B25024.estimate;
	      var dataObject = {
	        totalPop: datum.B25024001,
	        answerData: {
	          'one-family house detached from any other house': datum.B25024002,
	          'one-family house attached to one or more houses': datum.B25024003,
	          'building with 2 apartments': datum.B25024004,
	          'building with 3 or 4 apartments': datum.B25024005,
	          'building with 5 to 9 apartments': datum.B25024006,
	          'building with 10 to 19 apartments': datum.B25024007,
	          'building with 20+ apartments': datum.B25024008 + datum.B25024009,
	          'mobile home': datum.B25024010,
	          'boat, RV, van, etc.': datum.B25024011
	        },
	      };
	      return dataObject;
	    },
	  text: "% of the US Population lives in a ",
	  url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B25024&geo_ids=01000US',
	  type: 'housing'
	  },
	  11: {
	    dataKeys: function(data) {
	      var datum = data.data['01000US'].B12001.estimate;
	      var dataObject = {
	        totalPop: datum.B12001001,
	        answerData: {
	          'Never Married': datum.B12001003 + datum.B12001012,
	          'Currently Married': datum.B12001004 + datum.B12001013,
	          'Divorced': datum.B12001010 + datum.B12001019,
	          'Widowed': datum.B12001009 + datum.B12001018,
	        },
	      };
	      return dataObject;
	    },
	  text: "% of the US Population (over 15 years old) is ",
	  url: 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B12001&geo_ids=01000US',
	  type: 'marital'
	  },
	};

	module.exports = library;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var dom = __webpack_require__(1);
	var library = __webpack_require__(5);
	var utils = __webpack_require__(7);

	var result = {
	  compareData: compareData,
	  compareUserAgePopToTotalPop: compareUserAgePopToTotalPop,
	  getResults: getResults,
	  showTotalUniqueResult: showTotalUniqueResult
	};

	var totalUniqueResult = {1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1};

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
	  result.showTotalUniqueResult();
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
	  result.showTotalUniqueResult();
	}

	function getResults(e) {
	  if (e) {
	    e.preventDefault();
	  }
	  $.getJSON('/answers').done(function(answerData) {
	    dom.$indexBanner.empty();
	    dom.$questionLinks.empty();
	    configureResultsView(answerData);
	  });
	}

	function showTotalUniqueResult(numAnswers) {
	  var multipliedResult = multiplyResult();
	  $.getJSON(library.totalPop.url).done(function(data) {
	    var totalPop = data.data['01000US'].B01001.estimate.B01001001;
	    var numResult = (multipliedResult * totalPop);
	    var stringResult = numResult.toLocaleString('en-IN', { minimumFractionDigits: 2 });
	    if ($('#result-div').length === 0) {
	      dom.addTotalUniqueResultToDOM(multipliedResult, stringResult, numAnswers);
	    }
	    else {
	      dom.updateTotalUniqueResultOnDom(multipliedResult, stringResult);
	    }
	  });
	}

	//////////////////
	// PRIVATE METHODS
	//////////////////

	function configureResultsView(answerData) {
	  if (answerData.length === 0) {
	    result.showTotalUniqueResult("none");
	  }
	  else {
	    processAnswers(answerData);
	    var html = displayResults({array: answerData});
	    dom.$indexBanner.append(html);
	  }
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

	function processAnswers(answerArray) {
	  answerArray.forEach(function(answerObject) {
	    var qId = Number(answerObject.question.qID);
	    var userAnswer = answerObject.answer;
	    if (qId === 1) {
	      userAnswer = utils.getDateObject(userAnswer);
	    }
	    var apiURL = utils.returnAPI(qId, userAnswer);
	    makeAPIcall(apiURL, qId, userAnswer);
	  });
	}

	module.exports = result;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var library = __webpack_require__(5);

	var utils = {
	  getDateObject: getDateObject,
	  returnAPI: returnAPI
	};

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

	function returnAPI(qId, answer) {
	  if (qId === 1) {
	    var url = library[qId].url;
	    return [url[0] + answer.year + url[1] + answer.age + url[2],
	            url[3] + answer.year + url[4] + answer.mm + url[5] + answer.dd + url[6]];
	  } else {
	    return library[qId].url;
	  }
	}

	//////////////////
	// PRIVATE METHODS
	//////////////////

	function calculateAge(birthday) {
	  var ageDifferenceMilliseconds = Date.now() - birthday.getTime();
	  var ageDate = new Date(ageDifferenceMilliseconds);
	  return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

	module.exports = utils;


/***/ }
/******/ ]);