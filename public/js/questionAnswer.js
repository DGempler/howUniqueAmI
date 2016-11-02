var dom = require('./dom');
var result = require('./result');
var utils = require('./utils');

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
