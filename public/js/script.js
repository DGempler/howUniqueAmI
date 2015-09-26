$(function() {
  var $body = $('body');
  var $nav = $('nav');
  var $indexBanner = $('#index-banner');
  var passwordCheck;
  var $dropdown1 = $('#dropdown1');
  var $dropdownButton = $('.dropdown-button');
  var questionIndex;




  // $('select').material_select();

  // $dropdownButton.dropdown();

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
    $dropdown1.append('<li><a id="login-link" href="/login">Log in instead</a></li>');
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
    $dropdown1.append('<li><a id="signup-link" href="/signup">Sign Up</a></li>');
  });

  $dropdown1.on('submit', '#signup-form', function(e) {
    // e.stopPropagation();
    e.preventDefault();
    var $email = $('#email').val();
    var $password = $('#password').val();
    var $confirmPassword = $('#confirm-password').val();
    var $signupForm = $(this);
    if (passwordCheck) {
      var data = {user: {email: $email, password: $password}};
      $.ajax({
        data: data,
        dataType: 'json',
        url: '/signup',
        method: 'POST',
        success: function(data) {
          $dropdownButton.html('Menu<i class="material-icons right">arrow_drop_down</i>');
          $signupForm.trigger('click');
          var $loggedInMenu = $('<li class="logged-in-links"><a id="my-account" href="/users">My Profile</a></li>' +
                                '<li class="logged-in-links"><a id="logout" href="/logout">Logout</a></li>');
          $dropdown1.html($loggedInMenu);
        }
      });
    }
  });

  $dropdown1.on('submit', '#login-form', function(e) {
    e.preventDefault();
    // e.stopPropagation();
    var $loginForm = $(this);
    var $email = $loginForm.find('#email').val();
    var $password = $loginForm.find('#password').val();
    var data = {user: {email: $email, password: $password}};
    $.ajax({
      data: data,
      dataType: 'json',
      url: '/login',
      method: 'POST',
      success: function(data) {
        $dropdownButton.html('Menu<i class="material-icons right">arrow_drop_down</i>');
        $loginForm.trigger('click');
        var $loggedInMenu = $('<li class="logged-in-links"><a id="my-account" href="/users">My Profile</a></li>' +
                              '<li class="logged-in-links"><a id="logout" href="/logout">Logout</a></li>');
        $dropdown1.html($loggedInMenu);
      }
    });
  });


  $dropdown1.on('click', '.logged-in-links', function(e) {
    // e.stopPropagation();
    e.preventDefault();
    if ($(this).find('a').attr('id') === "logout") {
      $.getJSON('/logout').done(function(data) {
        $dropdownButton.html('Log in<i class="material-icons right">arrow_drop_down</i>');
        var html = loginMenu();
        $dropdown1.html(html);
      });
    }
    else if ($(this).find('a').attr('id') === "my-account") {
      var html = userAccount();
      $indexBanner.html(html);
      getResults();
    }
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

  $nav.on('click', '#logo', function(e) {
    e.preventDefault();
    var html = indexScreen();
    $indexBanner.html(html);
  });



  $nav.find('#login-signup').on("click", function(e) {
    e.preventDefault();

  });

  $nav.find('#nav-mobile').on('click', function(e) {
    e.preventDefault();
  });

  function getQuestion(number) {
    $.getJSON('/questions/' + number).done(function(data) {
      var question = createQuestion(data);
      $indexBanner.append(question);
      var $select = $('select');
      if ($select.length) {
        $select.material_select();
      }
      if (questionIndex === 21) {
        $indexBanner.find('#next-button').text('Submit');
        $indexBanner.find('#skip-button').text('Skip & Submit').attr('id', 'skip-submit-button');
      }
    });
  }

  function getNextQuestion() {
    $indexBanner.html('');
    getQuestion(questionIndex);
    questionIndex++;
  }

  $indexBanner.on('click', '#start-button', function(e) {
    e.preventDefault();
    questionIndex = 1;
    getNextQuestion();
  });

  $indexBanner.on('click', '#skip-button', function(e) {
    e.preventDefault();
    getNextQuestion();
  });

  $indexBanner.on('submit', '#question-form', function(e) {
    e.preventDefault();
    var $questionForm = $(this);
    var qID = $(this).attr('data-qID');
    var $input = $(this).find('input');
    var answer = $input.val().trim();
    if (answer === "" || answer === "Choose your option") {
      $questionForm.remove();
      getQuestion(questionIndex);
      questionIndex++;
    }
    else {
      var data = {qID: qID, answer: answer};
      $.ajax({
        url: '/answers',
        data: data,
        dataType: 'json',
        method: 'POST',
        success: function(data) {
          $questionForm.remove();
          if (questionIndex < 21) {
            getQuestion(questionIndex);
            questionIndex++;
          }
          else {
            $.getJSON('/answers').done(function(data) {
              var html = displayResults({array: data});
              $indexBanner.html('');
              $indexBanner.append(html);
            });
          }
        }
      });
    }
  });

  //remove skip submit button entirely?
  $indexBanner.on('click', '#skip-submit-button', getResults);

  $indexBanner.on('click', '#unique-button', getResults);

  function getResults(e) {
    if (e) {
      e.preventDefault();
      $indexBanner.html('');
    }
    $.getJSON('/answers').done(function(data) {
      processAnswers(data);
      var html = displayResults({array: data});
      $indexBanner.append(html);
    });
  }

//   " data-deleteId={{_id}} class="delete-answer-button
// data-editId={{_id}} class="edit-answer-button btn-l

// // $("#height-select").append($("<option></option>").val(1).html("One"));
// // $("#weight-select").append($("<option></option>").val(1).html("One"));

//goal: after clicking delete button, make edit answer button open form with a submit answer.
//this probably requires a different response, so a whole new event handler (kind of a mix between
  //post request and edit result)
  /*var qId =
        $answer.removeClass('edit-answer-form').attr('id', 'question-form').data('qID', )
        id="question-form" data-qID={{_id}}
        $answer.find('.answer').text('blank').attr('class', 'grey-text');
        $answer.show();*/

  $indexBanner.on('click', '.delete-answer-button', function(e) {
    e.preventDefault();
    var $answer = $(this).parent();
    var answerId = $(this).attr('data-deleteId');
    var data = {answerId: answerId};
    $.ajax({
      url:"/answers",
      method: "DELETE",
      dataType: 'json',
      data: data,
      success: function(data) {
        $answer.find('.answer').text('blank').attr('class', 'grey-text');
        $answer.show();
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


  $indexBanner.on('submit', '.edit-answer-form', function(e) {
    e.preventDefault();
    var $questionForm = $(this);
    var qId = $(this).attr('data-qMongId');
    var $input = $(this).find('input');
    var answer = $input.val().trim();
    if (answer === "" || answer === "Choose your option") {
      $questionForm.prev().show();
      $questionForm.remove();
    }
    else {
      var data = {qID: qId, answer: answer};
      $.ajax({
        url: '/answers',
        data: data,
        dataType: 'json',
        method: 'PUT',
        success: function(data) {
          $questionForm.prev().find('.answer').text(data.answer);
          $questionForm.prev().show();
          $questionForm.remove();
          }
      });
    }
  });

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
      case 4:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=01000US';
      case 5:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B01001&geo_ids=86000US' + answer + ',01000US';
      case 10:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B03002&geo_ids=01000US';
      case 11:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B05006&geo_ids=01000US';
      case 12:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B16007&geo_ids=01000US';
      case 14:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B15002&geo_ids=01000US';
      case 15:
        return 'http://api.censusreporter.org/1.0/data/show/latest?table_ids=B23025&geo_ids=01000US';
      default:
        console.log('some ting broketed');
    }
  }

  function calculateAge(birthday) {
    var ageDifferenceMilliseconds = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifferenceMilliseconds);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  function makeAPIcall(url, id, answer) {
    if (id === 1 || id === 2) {
      $.getJSON(url[0]).done(function(data1) {
        $.getJSON(url[1]).done(function(data2) {
          if (id === 1) {
            compareUserAgePopToTotalPop(data1, data2, id, answer);
          }
          else {
            compareNumPeopleBornThisDay(data1, data2, id, answer);
          }
        });
      });
    }
    else {
      $.getJSON(url).done(function(data) {
        switch(id) {
          case 4:
            compareGender(data, id, answer);
            break;
          case 5:
            compareLocation(data, id, answer);
            break;
          case 10:
            compareRace(data, id, answer);
            break;
          case 11:
            compareForeignBorn(data, id, answer);
            break;
          case 12:
            compareLanguage(data, id, answer);
            break;
          case 14:
            compareEducation(data, id, answer);
            break;
          case 15:
            compareEmployment(data, id, answer);
            break;
          default:
            console.log('some ting else broketed too');
        }
      });
    }

  }

  function compareUserAgePopToTotalPop(data1, data2, id, answer) {
    var userAgePop = data1[0].total;
    var totalPop = data2.total_population.population;
    var singleUniqueResult = userAgePop / totalPop;
    $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">Only ' + (singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' + answer + ' years old!</h5>');
  }

  function compareNumPeopleBornThisDay(data1, data2, id, answer) {
    var userAgePop = data1[0].total;
    var shareBDay = userAgePop / 365;
    var totalPop = data2.total_population.population;
    var singleUniqueResult = shareBDay / totalPop;
    $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">You celebrate your birthday along with about ' + shareBDay.toFixed() + ' other people in the US!</h5>');
    $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">Only about ' + (singleUniqueResult * 100).toFixed(5) + '% of the US Population has your exact birthday!</h5>');
  }

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
    $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">' + (singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' + answer.toLowerCase() + '!</h5>');
  }

  function compareLocation(data, id, answer) {
    var localPop = data.data['86000US' + answer].B01001.estimate.B01001001;
    var totalPop = data.data['01000US'].B01001.estimate.B01001001;
    var singleUniqueResult = localPop / totalPop;
    $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">Only ' + (singleUniqueResult * 100).toFixed(5) + '% of the US Population lives in the ' + answer + ' zip code!</h5>');
  }

  function compareRace(data, id, answer) {
    var raceObject = {
      'American Indian or Alaska Native': data.data['01000US'].B03002.estimate.B03002005,
      'Asian': data.data['01000US'].B03002.estimate.B03002006,
      'Black or African American': data.data['01000US'].B03002.estimate.B03002004,
      'Hispanic': data.data['01000US'].B03002.estimate.B03002012,
      'Native Hawaiian or Other Pacific Islander': data.data['01000US'].B03002.estimate.B03002007,
      'White': data.data['01000US'].B03002.estimate.B03002003,
      'Other': data.data['01000US'].B03002.estimate.B03002008,
      'Two or more races': data.data['01000US'].B03002.estimate.B03002009,
    };
    var chosenRacePop = raceObject[answer];
    var totalPop = data.data['01000US'].B03002.estimate.B03002001;
    var singleUniqueResult = chosenRacePop / totalPop;
    if (answer === "Two or more races") {
      answer.toLowerCase();
    }
    $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">' + (singleUniqueResult * 100).toFixed(2) + '% of the US Population is ' + answer + '!</h5>');
  }

  function compareForeignBorn(data, id, answer) {
    var foreignObject = {
      'The United States': data.data['01000US'].B05006.estimate.B05006001 - this['europe'] - this['asia'] - this['africa'] - this['oceania'],
      'Europe': data.data['01000US'].B05006.estimate.B05006002,
      'Asia': data.data['01000US'].B05006.estimate.B05006047,
      'Africa': data.data['01000US'].B05006.estimate.B05006091,
      'Oceania': data.data['01000US'].B05006.estimate.B05006116,
      'Latin America': data.data['01000US'].B05006.estimate.B05006123,
      'Other North America': data.data['01000US'].B05006.estimate.B05006159,
    };
    var totalPop = data.data['01000US'].B05006.estimate.B05006001;
    var chosenBorn = foreignObject[answer];
    var singleUniqueResult = chosenBorn / totalPop;
    if (answer === "The United States") {
      answer = answer[0].toLowerCase() + answer.slice(1);
    }
    else if (answer === "Other North America") {
      answer = "another part of North America";
    }
    $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">' + (singleUniqueResult * 100).toFixed(2) + '% of the US Population is from ' + answer + '!</h5>');
  }

  function compareLanguage(data, id, answer) {
    console.log(data);
    var languageObject = {
      'English only': data.data['01000US'].B16007.estimate.B16007003 + data.data['01000US'].B16007.estimate.B16007009 + data.data['01000US'].B16007.estimate.B16007015,
      'Spanish': data.data['01000US'].B16007.estimate.B16007004 + data.data['01000US'].B16007.estimate.B16007010 + data.data['01000US'].B16007.estimate.B16007016,
      'Other Indo-European': data.data['01000US'].B16007.estimate.B16007005 + data.data['01000US'].B16007.estimate.B160070011 + data.data['01000US'].B16007.estimate.B16007017,
      'Asian/Pacific Islander': data.data['01000US'].B16007.estimate.B16007006 + data.data['01000US'].B16007.estimate.B16007012 + data.data['01000US'].B16007.estimate.B16007018,
      'Other': data.data['01000US'].B16007.estimate.B16007007 + data.data['01000US'].B16007.estimate.B16007013 + data.data['01000US'].B16007.estimate.B16007019,
    };
    var totalPop = data.data['01000US'].B16007.estimate.B16007001;
    var chosenLanguage = languageObject[answer];
    var singleUniqueResult = chosenLanguage / totalPop;
    if (answer === "Other Indo-European") {
      answer = answer[0].toLowerCase() + answer.slice(1);
    }
    else if (answer === "Other") {
      answer = "another language";
    }
    $('#qId' + id).append('<h5 class="single-unique-result header col s12 light">' + (singleUniqueResult * 100).toFixed(2) + '% of the US Population speaks ' + answer + ' at home!</h5>');
  }

  function compareEducation(data, id, answer) {
    var datum = data.data['01000US'].B15002.estimate;
    var educationObject = {
      'None thru 8th grade': datum.B15002003 + datum.B15002004 + datum.B15002005 + datum.B15002006 + datum.B15002020 + datum.B15002021 + datum.B15002022 + datum.B15002023,
      '9th - 12th grade, no diploma': datum.B15002007 + datum.B15002008 + datum.B15002009 + datum.B15002010 + datum.B15002024 + datum.B15002025 + datum.B15002026 + datum.B15002027,
      'High school graduate (or equivalent)': datum.B15002011 + datum.B15002028,
      'Some college, no degree': datum.B15002012 + datum.B15002013 + datum.B15002029 + datum.B15002030,
      "Associate's degree": datum.B15002014 + datum.B15002031,
      "Bachelor's degree": datum.B15002015 + datum.B15002032,
      "Master's degree": datum.B15002016 + datum.B15002033,
      'Professional school degree': datum.B15002017 + datum.B15002034,
      'Doctorate degree': datum.B15002018 + datum.B15002035,
    };
    var totalPop = datum.B15002002 + datum.B15002019;
    var chosenEducation = educationObject[answer];
    var singleUniqueResult = chosenEducation / totalPop;
    $('#qId' + id).append("<h5 class='single-unique-result header col s12 light'>" + (singleUniqueResult * 100).toFixed(2) + "% of the US Population (over 25 years old) has an education level of: " + answer + ".</h5>");
  }

  function compareEmployment(data, id, answer) {
    var datum = data.data['01000US'].B23025.estimate;
    var employmentObject = {
      'Employed': datum.B23025004,
      'Unemployed': datum.B23025005,
      'Active Duty Military': datum.B23025006,
      'Not in the labor force': datum.B23025007,
    };
    var totalPop = datum.B23025004;
    var chosenEmployment = employmentObject[answer];
    var singleUniqueResult = chosenEmployment / totalPop;
    if (answer !== "Active Duty Military") {
      answer = answer[0].toLowerCase() + answer.slice(1);
    }
    $('#qId' + id).append("<h5 class='single-unique-result header col s12 light'>" + (singleUniqueResult * 100).toFixed(2) + "% of the US Population (over 16 years old) is " + answer + ".</h5>");
  }


  function capitalize(string) {
    var stringArray = string.split(' ');
    stringArray.forEach(function(word, index) {
      if (word.length > 3 && word !== "other") {
        stringArray[index] = word[0].toUpperCase() + word.slice(1);
      }
    });
    return stringArray.join(' ');
  }
/*
  function keywordCapitalize(string) {
    var stringArray = string.split(' ');
    stringArray.forEach(function(word, index) {
      if (word === "american" || "indian" || "alaska" || "native" || "asian" || "african" || "") {
        stringArray[index] = word[0].toUpperCase() + word.slice(1);
      }
    });
    return stringArray.join(' ');
  }*/


});
/*    var answerId = $(this).attr('data-editId');
    console.log(answerId);
    var data = {answerId: answerId};
    $ajax.({
      url:"/answers",
      method: "PUT",
      dataType: 'json',
      data: data,
      success: function(data) {

      }
*/