var dom = require('./dom');
var initEventHandlers = require('initEventHandlers');

$('.button-collapse').sideNav();

dom.$dropdownButton.dropdown({
    constrain_width: false,
    belowOrigin: true
});

initEventHandlers();
