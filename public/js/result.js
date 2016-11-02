var dom = require('./dom');

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
