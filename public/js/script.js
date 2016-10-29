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

  function deleteAccountSubmitHandler(e) {
    e.preventDefault();
    var $deleteAccountForm = $(this);
    var password = $deleteAccountForm.find('#delete-password').val();
    var userData = {password: password};
    auth.deleteUser(userData, $deleteAccountForm);
  }

  $('.button-collapse').sideNav();

  $dropdownButton.dropdown({
    constrain_width: false,
    belowOrigin: true
  });

});

module.exports = script;