$(function() {
  var $body = $('body');
  var $nav = $('nav');

  $nav.find('#login-signup').on("click", function(e) {
    e.preventDefault();

  });

  $nav.find('#nav-mobile').on('click', function(e) {
    e.preventDefault();
  })

// $("#height-select").append($("<option></option>").val(1).html("One"));
// $("#weight-select").append($("<option></option>").val(1).html("One"));


});