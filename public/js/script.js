var script = $(function() {

  var totalUniqueResult = {1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1};
  var qLinks = {1: "birthday", 2: "gender", 3: "race", 4: "place of birth", 5: "language",
                6: "education", 7: "employment", 8: "income", 9: "tenure", 10: "house type",
                11: "marital status"};

  // not used anywhere?
  // var $body = $('body');

  var $nav = $('nav');
  var $indexBanner = $('#index-banner');
  var $dropdown1 = $('#dropdown1');
  var $dropdownButton = $nav.find('.dropdown-button');
  var $dropdownText = $dropdownButton.find('#dropdown-text');
  var $questionLinks =$('#question-links');
  var questionIndex;
  var passwordCheck;



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

  function getUser() {
    var $userEditDelete = $(this);
    $.getJSON('/users').done(function(data) {
      var html = editUserAccount(data);
      $userEditDelete.after(html);
      $userEditDelete.hide();
    });
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

  $('.button-collapse').sideNav();

  $dropdownButton.dropdown({
    constrain_width: false,
    belowOrigin: true
  });

});

module.exports = script;