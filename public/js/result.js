var result = {
  getResults: getResults,
  multiplyResult: multiplyResult
};

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

module.exports = result;