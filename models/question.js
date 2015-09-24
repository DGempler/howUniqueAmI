var mongoose = require('mongoose');
var db = require('./index');

var questionSchema = new mongoose.Schema({
  qID: Number,
  questionContent: String,
  resultContent: String,
  input: String,
  data: [],
  source: String,
});

var Question = mongoose.model('Question', questionSchema);

Question.remove({}).exec();

var questionsArray = [
  {qID: 1, resultContent: "You are ", questionContent: "How old are you? ", input: "<input type='number' class='number-input' min='1' max='122' step='1' id='age-select' name='answer[age]' autofocus/>"},
  {qID: 2, resultContent: "You were born on ", questionContent: "Enter your birthday: ", input: "<input class='date-input' id='birthday-input' type='date' autofocus/>"},
  {qID: 3, resultContent: "Your first name is ", questionContent: "Enter your first name: ",
    input: "<input class='text-input' id='name-input' type='text' name='answer[name]' autofocus/>"},
  {qID: 4, resultContent: "You are a ", questionContent: "Gender: ", input: "<select id='gender-select' name='answer[gender]'><option value='' disabled selected>Choose your option</option>" +
  "<option value='male'>Male</option><option value='female'>Female</option></select>"},
  {qID: 5, resultContent: "You live in ", questionContent: "I live in: ",
    input: "<input class='text-input' id='location-input' type='text' name='answer[location]' placeholder='City, State' autofocus/>"},
  {qID: 6, resultContent: "Your hair color is: ", questionContent: "Hair Color: ", input: "<select id='hair-color-select' name='answer[hairColor]'> " +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='blue'>Blond</option>" +
    "<option value='brown'>Black</option>" +
    "<option value='green'>Brown</option>" +
    "<option value='hazel'>Gray</option>" +
    "</select>"},
  {qID: 7, resultContent: "Your eye color is: ", questionContent: "Eye Color: ", input: "<select id='eye-color-select' name='answer[eyeColor]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='blue'>Blue</option>" +
    "<option value='brown'>Brown</option>" +
    "<option value='green'>Green</option>" +
    "<option value='hazel'>Hazel</option>" +
    "</select>"},
  {qID: 8, resultContent: "Your height is ", questionContent: "Height: ", input: "Feet: <input type='number' class='number-input' min='4' max='6' step='1' id='height-feet-select' name='answer[height.feet]' autofocus/>" +
    "Inches: <input type='number' class='number-input' min='0' max='11' step='1' id='height-inches-select' name='answer[height.inches]' />"},
  {qID: 9, resultContent: "Your weight is ", questionContent: "Weight: ", input: "<input type='number' class='number-input' min='80' max='400' step='1' id='weight-select' name='answer[weight]' autofocus/>"},

  {qID: 10, resultContent: "You are ", questionContent: "Race: (choose one or more) ", input: "<select id='race-select' name='answer[race]' multiple='true'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='native'>American Indian or Alaska Native</option>" +
    "<option value='asian'>Asian</option>" +
    "<option value='black'>Black or African American</option>" +
    "<option value='hispanic'>Hispanic</option>" +
    "<option value='islander'>Native Hawaiian or Other Pacific Islander</option>" +
    "<option value='white'>White</option>" +
    "<option value='other'>Other</option>" +
    "</select>"},
  {qID: 11, resultContent: "You were born in ", questionContent: "I was born in: ",
    input: "<select id='born-select' name='answer[born]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='europe'>Europe</option>" +
    "<option value='asia'>Asia</option>" +
    "<option value='africa'>Africa</option>" +
    "<option value='oceania'>Oceania</option>" +
    "<option value='latin-america'>Latic America</option>" +
    "<option value='north-america'>North America</option>" +
    "</select>"},
  {qID: 12, resultContent: "At home I speak ", questionContent: "What language do you speak at home?",
    input: "<select id='language-select' name='answer[language]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='english'>English Only</option>" +
    "<option value='spanish'>Spanish</option>" +
    "<option value='indo-european'>Indo-European</option>" +
    "<option value='asian-islander'>Asian/Islander</option>" +
    "<option value='other'>Other</option>" +
    "</select>"},
  {qID: 13, resultContent: "You are ", questionContent: "Religion: ", input: "<select id='religion-select' name='answer[religion]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='christian'>Christian</option>" +
    "<option value='jewish'>Jewish</option>" +
    "<option value='muslim'>Muslim</option>" +
    "<option value='buddhist'>Buddhist</option>" +
    "<option value='unitarian'>Unitarian/Universalist</option>" +
    "<option value='hindu'>Hindu</option>" +
    "<option value='sikh'>Sikh</option>" +
    "<option value='wiccan'>Wiccan</option>" +
    "<option value='pagan'>Pagan</option>" +
    "<option value='spiritualist'>Spiritualist</option>" +
    "<option value='atheist'>Atheist</option>" +
    "<option value='agnostic'>Agnostic</option>" +
    "<option value='humanist'>Humanist</option>" +
    "<option value='none'>no religion</option>" +
    "<option value='other'>another unclassified religion</option>" +
    "</select>"},
  {qID: 14, resultContent: "Your education level is ", questionContent: "Education Level: ", input: "<select id='education-select-adult' name='answer[education]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='8th-grade'>None thru 8th grade</option>" +
    "<option value='11th-grade'>9th - 11th grade</option>" +
    "<option value='high-school'>High school graduate</option>" +
    "<option value='some-college'>Some college no degree</option>" +
    "<option value='associates'>Associate's degree</option>" +
    "<option value='bachelors'>Bachelor's degree</option>" +
    "<option value='masters'>Master's degree</option>" +
    "<option value='professional'>Professional degree</option>" +
    "<option value='doctoral'>Doctoral degree</option>" +
    "</select>"},
  {qID: 15, resultContent: "You are currently ", questionContent: "Employment Status: ", input: "<select id='employment-select' name='answer[employment]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='student'>A student</option>" +
    // "<optgroup label='Civilian'>" +
    "<option value='employed'>Employed</option>" +
    "<option value='unemployed'>Unemployed</option>" +
    "<option value='not-employed'>Not in the labor force</option>" +
    "</optgroup><optgroup label='Military'>" +
    "<option value='hindu'>Active Duty</option>" +
    "</optgroup>" +
    "</select>"},
  {qID: 16, resultContent: "My household income is ", questionContent: "Household income: ",
    input: "<select id='income-select' name='answer[income]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='under50'>Under $50k</option>" +
    "<option value='50to100'>$50k - $100k</option>" +
    "<option value='100to200'>$100k - $200k</option>" +
    "<option value='over200'>Over $200k</option>" +
    "</select>"},
  {qID: 17, resultContent: "You currently ", questionContent: "I currently: ",
    input: "<select id='tenure-select' name='answer[tenure]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='rent'>Rent</option>" +
    "<option value='own'>Own</option>" +
    "</select>"},
  {qID: 18, resultContent: "You live in a ", questionContent: "I live in a: ",
    input: "<select id='housing-select-adult' name='answer[housing]'><option value='' disabled selected>Choose your option</option> " +
    "<option value='1-unit-detached'>one-family house detached from any other house</option>" +
    "<option value='1-unit-attached'>one-family house attached to one or more houses</option>" +
    "<option value='2-apts'>building with 2 apartments</option>" +
    "<option value='3-apts'>building with 3 or 4 apartments</option>" +
    "<option value='5-apts'>building with 5 to 9 apartments</option>" +
    "<option value='10-apts'>building with 10 to 19 apartments</option>" +
    "<option value='20-apts'>building with 20+ apartments/option>" +
    "<option value='mobile'>mobile home</option>" +
    "<option value='etc'>boat, RV, van, etc.</option>" +
    "</select>"},
  {qID: 19, resultContent: "Your veteran status is ", questionContent: "Veteran status: ",
    input: "<select id='veteran-select' name='answer[veteran]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='none'>None</option>" +
    "<option value='WWII'>WWII</option>" +
    "<option value='Korea'>Korea</option>" +
    "<option value='Vietnam'>Vietnam</option>" +
    "<option value='gulf90s'>Gulf (1990s)</option>" +
    "<option value='gulf00s'>Gulf (2001-)</option>" +
    "</select>"},
  {qID: 20, resultContent: "Your marital status is ", questionContent: "Marital Status", input: "<select id='marital-status-select' name='answer[maritalStatus]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='never-married'>Never Married</option>" +
    "<option value='married'>Now Married</option>" +
    "<option value='divorced'>Divorced</option>" +
    "<option value='widowed'>Widowed</option>" +
    "</select>"},
    //add geonames autocomplete
  ];


questionsArray.forEach(function(question) {
  Question.create(question, function(err, question2) {
    if (err) throw err;
  });
});


module.exports = Question;

/*
{_id: "", resultContent: "Your education level: ", questionContent: "Education Level: ", input: "<select id='education-select-teen' name='answer[e<option value='' disabled selected>Choose your option</option>"d +
"ucation]'>" +
    "<option value='current'>Currently in school</option>" +
    "<option value='8th-grade'>None thru 8th grade</option>" +
    "<option value='11th-grade'>9th - 11th grade</option>" +
    "<option value='high-school'>High school graduate</option>" +
    "<option value='some-college'>Some college no degree</option>" +
    "<option value='associates'>Associate's degree</option>" +
    "<option value='bachelors'>Bachelor's degree</option>" +
    "</select>", ageCategories: ["teen"]},
*/