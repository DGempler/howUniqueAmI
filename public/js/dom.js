var dom = {
    addTotalUniqueResultToDOM: addTotalUniqueResultToDOM,
    changeFormType: changeFormType,
    configureResultsView: configureResultsView,
    createQLinks: createQLinks,
    configureQuestionsView: configureQuestionsView,
    displayIndex: displayIndex,
    displayUserAccount: displayUserAccount,
    notifyNoChangesMade: notifyNoChangesMade,
    updateTotalUniqueResultOnDom: updateTotalUniqueResultOnDom
};

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

function changeFormType(oldType, newType, oldText, newText) {
  var $form = $dropdown1.find('#' + oldType + '-form');
  $form.attr('id', newType + '-form');
  $(this).remove();
  $form.find('#' + oldType + '-button').text(newText).attr('id', newType + '-button');
  $dropdown1.append('<li><a class="center" id="' + oldType + '-link" href="/' +
                    oldType + '">'  + oldText + '</a></li>');
  return $form;
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

function displayIndex(loggedIn) {
  var html = indexScreen({loggedIn: loggedIn});
  $indexBanner.html(html);
  $questionLinks.empty();
}

function displayUserAccount() {
  var html = userAccount();
  $indexBanner.html(html);
  $questionLinks.empty();
}

function notifyNoChangesMade($editAccountForm) {
    $editAccountForm.parent().remove();
    $indexBanner.find('#user-edit-delete').show().after(
        '<h5 class="edit-message header col s12 light">' +
        'No changes have been made to your account.</h5><br/>');
}

function updateTotalUniqueResultOnDom(multipliedResult, stringResult) {
  $resultDiv = $indexBanner.find('#result-div');
  $resultDiv.find('#result-percent').text((multipliedResult * 100).toFixed(6));
  $resultDiv.find('#result-num').text(stringResult);
}

module.exports = dom;
