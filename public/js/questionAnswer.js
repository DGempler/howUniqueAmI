var dom = require('./dom');
var result = require('./result');
var utils = require('./utils');

var questionAnswer = {
  deleteAnswer: deleteAnswer,
  editAnswer: editAnswer,
  getAnswerAndSubmit: getAnswerAndSubmit,
  getQuestion: getQuestion,
  getQuestionAndCreateEditForm: getQuestionAndCreateEditForm,
  getNextQuestion: getNextQuestion,
  modifyAnswerGrammar: modifyAnswerGrammar,
  processAnswers: processAnswers,
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
      showTotalUniqueResult();
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

function getQuestion(number) {
  $.getJSON('/questions/' + number).done(function(questionData) {
    var question = createQuestion(questionData);
    dom.$indexBanner.empty();
    dom.$indexBanner.append(question);
    configureQuestionsView();
  })
  .fail(function() {
    $nav.find('.dropdown-button').click();
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

function getNextQuestion() {
  getQuestion(questionIndex);
  questionIndex++;
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

function startQuestions() {
  questionIndex = 1;
  getNextQuestion();
}

function submitAnswer(answerData, jumpToResults) {
  $.ajax({
    url: '/answers',
    data: answerData,
    dataType: 'json',
    method: 'POST',
    success: function(data) {
      if (questionIndex >= 12 || jumpToResults) {
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

module.exports = questionAnswer;
