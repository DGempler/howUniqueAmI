var result = {
  compareData: compareData,
  compareUserAgePopToTotalPop: compareUserAgePopToTotalPop,
  getResults: getResults,
  multiplyResult: multiplyResult,
  showTotalUniqueResult: showTotalUniqueResult
};

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

function multiplyResult() {
  var multipliedResult = 1;
  for (var qID in totalUniqueResult) {
    multipliedResult *= totalUniqueResult[qID];
  }
  return multipliedResult;
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

module.exports = result;