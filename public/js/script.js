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

  

  $('.button-collapse').sideNav();

  $dropdownButton.dropdown({
    constrain_width: false,
    belowOrigin: true
  });

});

module.exports = script;
