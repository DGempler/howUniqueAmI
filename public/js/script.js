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

  $('.button-collapse').sideNav();

  $dropdownButton.dropdown({
    constrain_width: false,
    belowOrigin: true
  });

});

module.exports = script;