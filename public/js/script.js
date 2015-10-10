$(function() {

  var totalUniqueResult = {1:1, 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1};
  var qLinks = {1: "age", 2: "birthday", 3: "gender", 4: "location", 5: "race", 6: "place of birth", 7: "language", 8: "education", 9: "employment", 10: "income", 11: "tenure", 12: "house type", 13: "marital status"};

  var $body = $('body');
  var $nav = $('nav');
  var $indexBanner = $('#index-banner');
  var $dropdown1 = $('#dropdown1');
  var $dropdownButton = $nav.find('.dropdown-button');
  var $dropdownText = $dropdownButton.find('#dropdown-text');
  var $questionLinks =$('#question-links');
  var questionIndex;
  var passwordCheck;

  // $('select').material_select();

  $dropdownButton.dropdown({
    constrain_width: false,
    belowOrigin: true
  });

  function validatePassword(pass, confPass) {
    if (pass !== confPass) {
      document.getElementById('confirm-password').setCustomValidity("Passwords Don't Match");
      return false;
    }
    else {
      document.getElementById('confirm-password').setCustomValidity('');
      return true;
    }
  }

  function getQuestion(number) {
    $.getJSON('/questions/' + number).done(function(data) {
      var question = createQuestion(data);
      $indexBanner.empty();
      $indexBanner.append(question);
      if ($('.qLinks').length === 0) {
        var links = questionLinks({qLinks: qLinks});
        $questionLinks.append(links);
      }
      if (questionIndex === 2) {
        $indexBanner.find('#back-button').hide();
      }
      var $select = $('select');
      if ($select.length) {
        $select.material_select();
      }
      if (questionIndex === 14) {
        $indexBanner.find('#next-button').text('Submit');
        $indexBanner.find('#skip-button').text('Skip & Submit').attr('id', 'skip-submit-button');
      }
    })
    .fail(function() {
      $nav.find('.dropdown-button').click();
    });
  }

  function getNextQuestion() {
    getQuestion(questionIndex);
    questionIndex++;
  }

  function getResults(e) {
    if (e) {
      e.preventDefault();
    }
    $.getJSON('/answers').done(function(data) {
      $indexBanner.empty();
      $questionLinks.empty();
      if (data.length === 0) {
        showTotalUniqueResult("none");
      }
      else {
        processAnswers(data);
        var html = displayResults({array: data});
        $indexBanner.append(html);
      }
    });
  }

  function processAnswers(answerArray) {
    answerArray.forEach(function(answerObject) {
      var qId = Number(answerObject.question.qID);
      var userAnswer = answerObject.answer;
      var apiURL = returnAPI(qId, userAnswer);
      makeAPIcall(apiURL, qId, userAnswer);
    });
  }

  function returnAPI(qId, answer) {
    switch(qId) {
      case 1:
        var today = new Date();
        var year = today.getFullYear();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        return ['http://api.population.io:80/1.0/population/' + year + '/United%20States/' + answer + '/',
                'http://api.population.io:80/1.0/population/United%20States/' + year + '-' + mm + '-' + dd + '/'];
      case 2:
        var today = new Date();
        var year = today.getFullYear();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var bDay = new Date(answer.slice(0,4), Number(answer.slice(5, 7)) -1, answer.slice(8,10));
        var age = calculateAge(bDay);
        return ['http://api.population.io:80/1.0/population/' + year + '/United%20States/' + age + '/',
                'http://api.population.io:80/1.0/population/United%20States/' + year + '-' + mm + '-' + dd + '/'];
      case 3:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=01000US';
      case 4:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=86000US' + answer + ',01000US';
      case 5:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B03002&geo_ids=01000US';
      case 6:
        return ['http://api.censusreporter.org/1.0/data/show/latest?table_ids=B05006&geo_ids=01000US',
                'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=01000US'];
      case 7:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B16007&geo_ids=01000US';
      case 8:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B15002&geo_ids=01000US';
      case 9:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B23025&geo_ids=01000US';
      case 10:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B19001&geo_ids=01000US';
      case 11:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B25003&geo_ids=01000US';
      case 12:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B25024&geo_ids=01000US';
      case 13:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B12001&geo_ids=01000US';
      default:
        console.log('some ting broketed');
    }
  }

  function makeAPIcall(url, id, answer) {
    if (id === 1 || id === 2 || id ===  6) {
      $.getJSON(url[0]).done(function(data1) {
        $.getJSON(url[1]).done(function(data2) {
          if (id === 1) {
            compareUserAgePopToTotalPop(data1, data2, id, answer);
          }
          else if (id === 2){
            compareNumPeopleBornThisDay(data1, data2, id, answer);
          }
          else {
            var lib = activateLibrary('born');
            compareData(data1, data2, id, answer, lib.answerData.born, lib.compareToData.totalPop, lib.compareToData.datum, "born", lib.text.born);
          }
        });
      });
    }
    else {
      $.getJSON(url).done(function(data) {
        var lib = activateLibrary();
        switch(id) {
          case 3:
            compareData(data, null, id, answer, lib.answerData.gender, lib.compareToData.gender.totalPop, null, "gender", lib.text.gender);
            break;
          case 4:
            compareLocation(data, id, answer);
            break;
          case 5:
            compareData(data, null, id, answer, lib.answerData.race, lib.compareToData.race.totalPop, null, "race", lib.text.race);
            break;
          case 7:
            compareData(data, null, id, answer, lib.answerData.language, lib.compareToData.totalPop, null, "language", lib.text.language);
            break;
          case 8:
            compareData(data, null, id, answer, lib.answerData.education, lib.compareToData.education.totalPop, lib.compareToData.education.datum, "education", lib.text.education);
            break;
          case 9:
            compareData(data, null, id, answer, lib.answerData.employment, lib.compareToData.employment.totalPop, lib.compareToData.employment.datum, "employment", lib.text.employment);
            break;
          case 10:
            compareData(data, null, id, answer, lib.answerData.income, lib.compareToData.income.totalPop, lib.comparetoData.income.datum, "income", lib.text.income);
            break;
          case 11:
            compareData(data, null, id, answer, lib.answerData.tenure, lib.compareToData.tenure.totalPop, lib.compareToData.tenure.datum, "tenure", lib.text.tenure);
            break;
          case 12:
            compareData(data, null, id, answer, lib.answerData.housing, lib.compareToData.housing.totalPop, lib.compareToData.housing.datum, "housing", lib.text.housing);
            break;
          case 13:
            compareData(data, null, id, answer, lib.answerData.marital, lib.compareToData.marital.totalPop, lib.compareToData.marital.datum, "marital", lib.text.marital);
            break;
          default:
            console.log('some ting else broketed too');
        }
      });
    }
  }














  function calculateAge(birthday) {
    var ageDifferenceMilliseconds = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifferenceMilliseconds);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  //REFACTOR ALL OF THESE!!!
  function compareUserAgePopToTotalPop(data1, data2, id, answer) {
    var userAgePop = data1[0].total;
    var totalPop = data2.total_population.population;
    var singleUniqueResult = userAgePop / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">Only ' + (singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' + answer + ' years old!</h5>');
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' + answer + ' years old!');
    }
    showTotalUniqueResult();
  }

  //remove this option
  function compareNumPeopleBornThisDay(data1, data2, id, answer) {
    var userAgePop = data1[0].total;
    var shareBDay = userAgePop / 365;
    var totalPop = data2.total_population.population;
    var singleUniqueResult = shareBDay / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">You celebrate your birthday along with about ' + shareBDay.toFixed() + ' other people in the US!</h5>');
      $('#qId' + id).append('<h5 class="single-unique-result2 header col s12 light">Only about ' + (singleUniqueResult * 100).toFixed(5) + '% of the US Population has your exact birthday!</h5>');
    }
    else {
      $displayedResult.html('You celebrate your birthday along with about ' + shareBDay.toFixed() + ' other people in the US!');
      $displayedResult.next.html('Only about ' + (singleUniqueResult * 100).toFixed(5) + '% of the US Population has your exact birthday!');
    }
    showTotalUniqueResult();
    }







/*
  function compareGender(data, id, answer) {
    var totalPop = data.data['01000US'].B01001.estimate.B01001001;
    var genderPop;
    if (answer === 'Male') {
      genderPop = data.data['01000US'].B01001.estimate.B01001002;
    }
    else {
      genderPop = data.data['01000US'].B01001.estimate.B01001026;
    }
    var singleUniqueResult = genderPop / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">' + (singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' + answer.toLowerCase() + '!</h5>');
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' + answer.toLowerCase() + '!');
    }
    showTotalUniqueResult();
  }
*/
  //remove location completely

  function compareLocation(data, id, answer) {
    var localPop = data.data['86000US' + answer].B01001.estimate.B01001001;
    var totalPop = data.data['01000US'].B01001.estimate.B01001001;
    var singleUniqueResult = localPop / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">Only ' + (singleUniqueResult * 100).toFixed(5) + '% of the US Population lives in the ' + answer + ' zip code!</h5>');
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(5) + '% of the US Population lives in the ' + answer + ' zip code!');
    }
    showTotalUniqueResult();
  }




/*
  function compareRace(data, id, answer) {
    // var raceObject = ;
    var chosenRacePop = raceObject[answer];
    var totalPop = data.data['01000US'].B03002.estimate.B03002001;
    var singleUniqueResult = chosenRacePop / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    if (answer === "Two or more races") {
      answer.toLowerCase();
    }
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">' + (singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' + answer + '!</h5>');
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' + answer + '!');
    }
    showTotalUniqueResult();
  }
*/





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



/*
  function compareForeignBorn(data1, data2, id, answer) {
    var datum = data1.data['01000US'].B05006.estimate;
    var totalPop = data2.data['01000US'].B01001.estimate.B01001001;
    // var foreignObject = ;
    var chosenBorn = foreignObject[answer];
    var singleUniqueResult = chosenBorn / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    if (answer === "The United States") {
      answer = answer[0].toLowerCase() + answer.slice(1);
    }
    else if (answer === "Other North America") {
      answer = "another part of North America";
    }
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">' + (singleUniqueResult * 100).toFixed(2) + '% of the US Population is from ' + answer + '!</h5>');
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + '% of the US Population is from ' + answer + '!');
    }
    showTotalUniqueResult();
  }
*/

/*
  function compareLanguage(data, id, answer) {
    // var languageObject = ;
    var totalPop = data.data['01000US'].B16007.estimate.B16007001;
    var chosenLanguage = languageObject[answer];
    var singleUniqueResult = chosenLanguage / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    if (answer === "Other Indo-European") {
      answer = "another Indo-European language";
    }
    else if (answer === "Other") {
      answer = "another language";
    }
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">' + (singleUniqueResult * 100).toFixed(2) + '% of the US Population speaks ' + answer + ' at home!</h5>');
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + '% of the US Population speaks ' + answer + ' at home!');
    }
    showTotalUniqueResult();
  }
*/


/*
  function compareEducation(data, id, answer) {
    var datum = data.data['01000US'].B15002.estimate;
    // var educationObject = ;
    var totalPop = datum.B15002002 + datum.B15002019;
    var chosenEducation = educationObject[answer];
    var singleUniqueResult = chosenEducation / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append("<h5 class='single-unique-result header col s12 light'>" + (singleUniqueResult * 100).toFixed(2) + "% of the US Population (over 25 years old) has an education level of: " + answer + ".</h5>");
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + "% of the US Population (over 25 years old) has an education level of: " + answer + ".");
    }
    showTotalUniqueResult();
  }
*/



/*
  function compareEmployment(data, id, answer) {
    var datum = data.data['01000US'].B23025.estimate;
    // var employmentObject = ;
    var totalPop = datum.B23025001;
    var chosenEmployment = employmentObject[answer];
    var singleUniqueResult = chosenEmployment / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    if (answer !== "Active Duty Military") {
      answer = answer[0].toLowerCase() + answer.slice(1);
    }
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append("<h5 class='single-unique-result header col s12 light'>" + (singleUniqueResult * 100).toFixed(2) + "% of the US Population (over 16 years old) is " + answer + ".</h5>");
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + "% of the US Population (over 16 years old) is " + answer + ".");
    }
    showTotalUniqueResult();
  }
*/

/*
  function compareIncome(data, id, answer) {
    var datum = data.data['01000US'].B19001.estimate;
    // var incomeObject = ;
    var totalPop = datum.B19001001;
    var chosenIncome = incomeObject[answer];
    var singleUniqueResult = chosenIncome / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    if (answer === 'Less than $25,000') {
      answer = answer[0].toLowerCase() + answer.slice(1);
    }
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append("<h5 class='single-unique-result header col s12 light'>" + (singleUniqueResult * 100).toFixed(2) + "% of the US Population's annual household income is " + answer + ".</h5>");
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + "% of the US Population's annual household income is " + answer + ".");
    }
    showTotalUniqueResult();
  }
  */

/*
  function compareTenure(data, id, answer) {
    var datum = data.data['01000US'].B25003.estimate;
    // var tenureObject = ;
    var totalPop = datum.B25003001;
    var chosenTenure = tenureObject[answer];
    var singleUniqueResult = chosenTenure / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    answer = answer[0].toLowerCase() + answer.slice(1);
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append("<h5 class='single-unique-result header col s12 light'>" + (singleUniqueResult * 100).toFixed(2) + "% of the US Population " + answer + "s their home.</h5>");
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + "% of the US Population " + answer + "s their home.");
    }
    showTotalUniqueResult();
  }
*/

/*
  function compareHousingType(data, id, answer) {
    var datum = data.data['01000US'].B25024.estimate;
    // var housingObject = ;
    var totalPop = datum.B25024001;
    var chosenHousing = housingObject[answer];
    var singleUniqueResult = chosenHousing / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append("<h5 class='single-unique-result header col s12 light'>" + (singleUniqueResult * 100).toFixed(2) + "% of the US Population lives in a " + answer + ".</h5>");
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + "% of the US Population lives in a " + answer + ".");
    }
    showTotalUniqueResult();
  }
*/



/*
  function compareMaritalStatus(data, id, answer) {
    var datum = data.data['01000US'].B12001.estimate;
    // var marriageObject = ;
    var totalPop = datum.B12001001;
    var chosenMaritalStatus = marriageObject[answer];
    var singleUniqueResult = chosenMaritalStatus / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append("<h5 class='single-unique-result header col s12 light'>" + (singleUniqueResult * 100).toFixed(2) + "% of the US Population (over 15 years old) is " + answer.toLowerCase() + ".</h5>");
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + "% of the US Population (over 15 years old) is " + answer.toLowerCase() + ".");
    }
    showTotalUniqueResult();
  }
*/
  function compareData(data1, data2, id, answer, answerData, totalPop, datum, type, text) {
    var chosenTypePop = answerData[answer];
    var singleUniqueResult = chosenTypePop / totalPop;
    totalUniqueResult[id] = singleUniqueResult;
    var answer = modifyAnswerGrammar(answer, type);
    var $displayedResult = $('#qId' + id).find('.single-unique-result');
    if ($displayedResult.length === 0) {
      $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">' + (singleUniqueResult * 100).toFixed(2) + text + answer + '.</h5>');
    }
    else {
      $displayedResult.html((singleUniqueResult * 100).toFixed(2) + text + answer + '.');
    }
    showTotalUniqueResult();
  }

  function showTotalUniqueResult(numAnswers) {
    var multipliedResult = 1;
    for (var qID in totalUniqueResult) {
      multipliedResult *= totalUniqueResult[qID];
    }
    $.getJSON('http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=01000US').done(function(data) {
      var totalPop = data.data['01000US'].B01001.estimate.B01001001;
      var numResult = (multipliedResult * totalPop);
      var stringResult = numResult.toLocaleString('en-IN', { minimumFractionDigits: 2 });
      if ($('#result-div').length === 0) {
        var $div = $('<div id="result-div" class="row center"></div');
        $indexBanner.append($div);
        $div.append("<h5 class='total-unique-result header col s12 light'>You are just like <span id='result-percent'>" + (multipliedResult * 100).toFixed(6) + "</span>% of the US Population!</h5>");
        $div.append("<h5 class='total-unique-result header col s12 light'>That means there are only <span id='result-num'>" + stringResult + "</span> people in the U.S. JUST LIKE YOU!!!!</h5>");
        $div.append("<h5 class='total-unique-result header col s12 light'>Like, LOL OMG <a>SHARE!</a></h5>");
        if (numAnswers === "none") {
          var html = noQuestionsAnswered();
          $indexBanner.append(html);
        }
      }
      else {
        $resultDiv = $indexBanner.find('#result-div');
        $resultDiv.find('#result-percent').text((multipliedResult * 100).toFixed(6));
        $resultDiv.find('#result-num').text(stringResult);
      }
    });
  }


  //Event Handlers
  $dropdown1.on('click', 'input', function(e) {
    e.stopPropagation();
  });

  $dropdown1.on('click', 'button', function(e) {
    e.stopPropagation();
  });

  $dropdown1.on('click', '#signup-link', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var $form = $dropdown1.find('#login-form');
    var $passwordConfirm = $('<div class="input-field"><input type="password" name="user[confirmPassword]" id="confirm-password" placeholder="Confirm Password" required/></div>');
    $form.attr('method', "POST");
    $form.attr('action', '/signup');
    $form.attr('id', 'signup-form');
    $(this).remove();
    $passwordConfirm.insertBefore('#login-button');
    $form.find('#login-button').text('Sign up').attr('id', 'signup-button');
    $dropdown1.append('<li><a class="center" id="login-link" href="/login">Log in instead</a></li>');
  });

  $dropdown1.on('click', '#login-link', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var $form = $dropdown1.find('#signup-form');
    $form.attr('method', "GET");
    $form.attr('action', '/login');
    $form.attr('id', 'login-form');
    $(this).remove();
    $form.find('#confirm-password').parent().remove();
    $form.find('#signup-button').text('Log in').attr('id', 'login-button');
    $dropdown1.append('<li><a class="center" id="signup-link" href="/signup">Sign Up</a></li>');
  });

  $dropdown1.on('submit', '#signup-form', function(e) {
    // e.stopPropagation();
    e.preventDefault();
    var email = $dropdown1.find('#email').val();
    var password = $dropdown1.find('#password').val();
    var $signupForm = $(this);
    if (passwordCheck) {
      var data = {user: {email: email, password: password}};
      $.ajax({
        data: data,
        dataType: 'json',
        url: '/signup',
        method: 'POST',
        success: function(data) {
          $dropdownText.text('Menu');
          $signupForm.trigger('click');
          var $loggedInMenu = loggedInMenuHTML();
          $dropdown1.html($loggedInMenu);
          questionIndex = 1;
          getNextQuestion();
        },
        error: function(xhr, text, error) {
          Materialize.toast('This user email already exists', 2000);
        }
      });
    }
  });

  $dropdown1.on('submit', '#login-form', function(e) {
    e.preventDefault();
    // e.stopPropagation();
    var $loginForm = $(this);
    var email = $loginForm.find('#email').val();
    var password = $loginForm.find('#password').val();
    var data = {user: {email: email, password: password}};
    $.ajax({
      data: data,
      dataType: 'json',
      url: '/login',
      method: 'POST',
      success: function(data) {
        $dropdownText.text('Menu');
        $loginForm.trigger('click');
        var $loggedInMenu = loggedInMenuHTML();
        $dropdown1.html($loggedInMenu);
        var html = userAccount();
        $indexBanner.html(html);
        $questionLinks.empty();
      },
      error: function(xhr, text, error) {
          $dropdown1.find('#password').val('');
          Materialize.toast('Invalid Email or Password', 2000);
      }
    });
  });

  $dropdown1.on('click', '.logged-in-links', function(e) {
    // e.stopPropagation();
    e.preventDefault();
    if ($(this).find('a').attr('id') === "logout") {
      $.getJSON('/logout').done(function(data) {
        $dropdownText.text('Log in');
        var loginText = loginMenu();
        $dropdown1.html(loginText);
        var html = indexScreen({loggedIn: false});
        $indexBanner.html(html);
        $questionLinks.empty();
      });
    }
    else if ($(this).find('a').attr('id') === "my-account") {
      var html = userAccount();
      $indexBanner.html(html);
      $questionLinks.empty();
    }
    else if ($(this).find('a').hasClass('start-button')) {
      questionIndex = 1;
      getNextQuestion();
    }
    else if ($(this).find('a').hasClass('unique-button')) {
      $indexBanner.empty();
      $questionLinks.empty();
      getResults();
    }
  });

  $indexBanner.on('click', '#user-edit-delete', function(e) {
    e.preventDefault();
    var $userEditDelete = $(this);
    $indexBanner.find('.edit-message').remove();
    // $userAccount = $(this).parent().parent();
    $.getJSON('/users').done(function(data) {
      var html = editUserAccount(data);
      $userEditDelete.after(html);
      $userEditDelete.hide();
    });
  });

  $indexBanner.on('submit', '#edit-account-form', function(e) {
    e.preventDefault();
    var $editAccountForm = $(this);
    var currentEmail = $editAccountForm.find('#current-email').val();
    var email = $editAccountForm.find('#email').val();
    var currentPassword = $editAccountForm.find('#current-password').val();
    var password = $editAccountForm.find('#password').val();
    if (currentEmail === email && password === "") {
      $editAccountForm.parent().remove();
      $indexBanner.find('#user-edit-delete').show().after('<h5 class="edit-message header col s12 light">No changes have been made to your account.</h5><br/>');
    }
    else {
      if (currentEmail === email) {
        email = 0;
      }
      if (password === "") {
        password = 0;
      }
      var data = {current: {email: currentEmail, password: currentPassword}, upcoming: {email: email, password: password}};
      $.ajax({
        data: data,
        dataType: 'json',
        url: '/users',
        method: 'PUT',
        success: function(data) {
          $editAccountForm.parent().remove();
          $indexBanner.find('#user-edit-delete').show().after('<h5 class="edit-message header col s12 light">Your account has been successfully updated.</h5><br/>');
        },
        error: function(err) {
          console.log(err);
          if (err.status === 401) {
            Materialize.toast('Invalid Password', 2000);
          }
          if (err.status === 409) {
            Materialize.toast('This user email already exists', 2000);
          }
        }
      });
    }
  });

  $indexBanner.on('submit', '#delete-account-form', function(e) {
    e.preventDefault();
    var $deleteAccountForm = $(this);
    var password = $deleteAccountForm.find('#delete-password').val();
    var data = {password: password};
    $.ajax({
      data: data,
      dataType: 'json',
      url: '/users',
      method: "DELETE",
      success: function(data) {
        $deleteAccountForm.parent().remove();
        $indexBanner.empty().after('<h5 class="delete-message center header col s12 light">Your account has been successfully deleted. Please login to continue.</h5><br/>');
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
  });

  $questionLinks.on('click', '.qLinks', function(e) {
    e.preventDefault();
    questionIndex = $(this).attr('data-qId');
    var $questionForm = $('#question-form');
    var qID = $questionForm.attr('data-MongID');
    var $input = $questionForm.find('input');
    var answer = $input.val().trim();
    console.log(answer);
    if (answer !== "" && answer !== "Choose your option") {
      var data = {qID: qID, answer: answer};
      $.ajax({
        url: '/answers',
        data: data,
        dataType: 'json',
        method: 'POST',
        success: function(data) {
          getNextQuestion();
        }
      });
    }
    else {
      getNextQuestion();
    }
  });

  $dropdown1.on('keyup', '#password', function() {
    var $confirmPassword = $('#confirm-password');
    if ($confirmPassword.length) {
      var $password = $('#password').val();
      $confirmPassword = $confirmPassword.val();
      passwordCheck = validatePassword($password, $confirmPassword);
    }
  });
  $dropdown1.on('keyup', '#confirm-password', function() {
    var $password = $('#password').val();
    var $confirmPassword = $('#confirm-password').val();
    passwordCheck = validatePassword($password, $confirmPassword);
  });

  $indexBanner.on('keyup', '#password', function() {
    var $confirmPassword = $('#confirm-password');
    if ($confirmPassword.length) {
      var $password = $('#password').val();
      $confirmPassword = $confirmPassword.val();
      passwordCheck = validatePassword($password, $confirmPassword);
    }
  });

  $indexBanner.on('keyup', '#confirm-password', function() {
    var $password = $('#password').val();
    var $confirmPassword = $('#confirm-password').val();
    passwordCheck = validatePassword($password, $confirmPassword);
  });

  $nav.on('click', '#logo', function(e) {
    e.preventDefault();
    var html = indexScreen({loggedIn: false});
    $indexBanner.html(html);
    $questionLinks.empty();
  });

  $nav.find('#login-signup').on("click", function(e) {
    e.preventDefault();
  });

  $nav.find('#nav-mobile').on('click', function(e) {
    e.preventDefault();
  });

  $indexBanner.on('click', '.start-button', function(e) {
    e.preventDefault();
    questionIndex = 1;
    getNextQuestion();
  });

  $indexBanner.on('click', '#back-button', function(e) {
    e.preventDefault();
    questionIndex -= 2;
    getNextQuestion();
  });

  $indexBanner.on('click', '#skip-button', function(e) {
    e.preventDefault();
    getNextQuestion();
  });

  $indexBanner.on('submit', '#question-form', function(e) {
    e.preventDefault();
    var $questionForm = $(this);
    var qID = $questionForm.attr('data-MongID');
    var $input = $questionForm.find('input');
    var answer = $input.val().trim();
    if (answer === "" || answer === "Choose your option") {
      $questionForm.remove();
      if (questionIndex < 14) {
        getQuestion(questionIndex);
        questionIndex++;
      }
      else {
        getResults();
      }
    }
    else {
      var data = {qID: qID, answer: answer};
      $.ajax({
        url: '/answers',
        data: data,
        dataType: 'json',
        method: 'POST',
        success: function(data) {
          if (questionIndex < 14) {
            getQuestion(questionIndex);
            questionIndex++;
          }
          else {
            getResults();
          }
        }
      });
    }
  });

  //remove skip submit button entirely?
  $indexBanner.on('click', '#skip-submit-button', getResults);

  $indexBanner.on('click', '.unique-button', function(e) {
    e.preventDefault();
    var $questionForm = $('#question-form');
    if ($questionForm.length !== 0) {
      var qID = $questionForm.attr('data-MongID');
      var $input = $questionForm.find('input');
      var answer = $input.val().trim();
      if (answer !== "" && answer !== "Choose your option") {
        var data = {qID: qID, answer: answer};
        $.ajax({
          url: '/answers',
          data: data,
          dataType: 'json',
          method: 'POST',
          success: function(data) {
            getResults();
          }
        });
      }
      else {
        getResults();
      }
    }
    else {
      getResults();
    }
  });

  $indexBanner.on('click', '.delete-answer-button', function(e) {
    e.preventDefault();
    var $answer = $(this).parent();
    var answerId = $(this).attr('data-deleteId');
    var qId = $(this).attr('data-qID');
    var data = {answerId: answerId};
    $.ajax({
      url:"/answers",
      method: "DELETE",
      dataType: 'json',
      data: data,
      success: function(data) {
        $answer.find('.answer').text('blank').addClass('grey-text');
        $answer.show();
        totalUniqueResult[qId] = 1;
        showTotalUniqueResult();
      }
    });
  });

  $indexBanner.on('click', '.edit-answer-button', function(e) {
    e.preventDefault();
    var $answer = $(this).parent();
    var qId = Number($(this).attr('data-qId'));
    $.getJSON('/questions/' + qId).done(function(data) {
      var html = editAnswer(data);
      $answer.after(html);
      var $select = $('select');
      if ($select.length) {
        $select.material_select();
      }
      $answer.hide();
    });
  });

  $indexBanner.on('click', '.cancel-button', function(e) {
    e.preventDefault();
    var $questionForm = $(this).parent();
    $questionForm.prev().show();
    $questionForm.remove();
  });

  $indexBanner.on('submit', '.edit-answer-form', function(e) {
    e.preventDefault();
    var $questionForm = $(this);
    var mongId = $questionForm.attr('data-qMongId');
    var $input = $questionForm.find('input');
    var answer = $input.val().trim();
    if (answer === "" || answer === "Choose your option") {
      $questionForm.prev().show();
      $questionForm.remove();
    }
    else {
      var data = {qID: mongId, answer: answer};
      $.ajax({
        url: '/answers',
        data: data,
        dataType: 'json',
        method: 'PUT',
        success: function(data) {
          $questionForm.prev().find('.answer').text(data.answer).removeClass('grey-text');
          var qId = Number($questionForm.prev().attr('data-qId'));
          var apiURL = returnAPI(qId, data.answer);
          makeAPIcall(apiURL, qId, data.answer);
          $questionForm.prev().show();
          $questionForm.remove();
          }
      });
    }
  });
});
