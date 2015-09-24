var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('cookie-session');
var exphbs = require('express-handlebars');
var db = require('./models');
var morgan = require('morgan');
var favicon = require('serve-favicon');

app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(favicon(__dirname + '/public/images/favicon.png'));

app.use(session({
  maxAge: 60 * 60 * 1000,
  secret: "goodDeal",
  name: "howUniqueAmI",
  activeDuration: 20 * 60 * 1000,
}));

require('./controllers/index');

app.listen(process.env.PORT || 3000, function() {
  console.log("Starting a server on port " + process.env.PORT || "http://localhost:3000");
});
