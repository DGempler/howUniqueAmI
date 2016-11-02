var dom = require('./dom');
var initEventHandlers = require('./eventHandlers');

$('.button-collapse').sideNav();

dom.$dropdownButton.dropdown({
  constrain_width: false,
  belowOrigin: true
});

initEventHandlers();
