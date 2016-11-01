var dom = {
    $dropdown1: $('#dropdown1'),
    // check to make sure dom.$nav is found
    $dropdownButton: dom.$nav.find('.dropdown-button'),
    $dropdownText: dom.$dropdownButton.find('#dropdown-text'),
    $indexBanner: $('#index-banner'),
    $nav: $('nav'),
    $questionLinks: $('#question-links'),
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

function configureResultsView(answerData) {
    if (answerData.length === 0) {
        showTotalUniqueResult("none");
    }
    else {
        processAnswers(answerData);
        var html = displayResults({array: answerData});
        dom.$indexBanner.append(html);
    }
}

function configureQuestionsView() {
  var $select = $('select');
  if ($('.qLinks').length === 0) {
    createQLinks();
  }
  if (questionIndex === 2) {
    dom.$indexBanner.find('#back-button').hide();
  }
  if ($select.length) {
    $select.material_select();
  }
  if (questionIndex === 12) {
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

//////////////////
// PRIVATE METHODS & VARIABLES
//////////////////

function createQLinks() {
    var links = questionLinks({qLinks: qLinks});
    dom.$questionLinks.append(links);
}

var qLinks = {1: "birthday", 2: "gender", 3: "race", 4: "place of birth", 5: "language",
              6: "education", 7: "employment", 8: "income", 9: "tenure", 10: "house type",
              11: "marital status"};


module.exports = dom;
