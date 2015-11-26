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

// Question.remove({}).exec();

var questionsArray = [
  {qID: 1, resultContent: "I am ", questionContent: "How old are you? ", input: "<input type='number' class='number-input' min='1' max='120' step='1' id='age-select' name='answer[age]' autofocus/>"},
  {qID: 2, resultContent: "I was born on ", questionContent: "Enter your birthday: ", input: "<input class='date-input' id='birthday-input' type='date' autofocus/>"},
  {qID: 3, resultContent: "I am a ", questionContent: "Select your gender: ", input: "<select id='gender-select' name='answer[gender]'><option value='' disabled selected>Choose your option</option>" +
  "<option value='male'>Male</option><option value='female'>Female</option></select>"},
  {qID: 4, resultContent: "I am ", questionContent: "Select your race:", input: "<select id='race-select' name='answer[race]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='native'>American Indian or Alaska Native</option>" +
    "<option value='asian'>Asian</option>" +
    "<option value='black'>Black or African American</option>" +
    "<option value='hispanic'>Hispanic</option>" +
    "<option value='islander'>Native Hawaiian or Other Pacific Islander</option>" +
    "<option value='white'>White</option>" +
    "<option value='other'>Other</option>" +
    "<option value='two'>Two or more races</option>" +
    "</select>"},
  {qID: 5, resultContent: "I was born in ", questionContent: "Select your place of birth: ",
    input: "<select id='born-select' name='answer[born]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='europe'>The United States</option>" +
    "<option value='europe'>Europe</option>" +
    "<option value='asia'>Asia</option>" +
    "<option value='africa'>Africa</option>" +
    "<option value='oceania'>Oceania</option>" +
    "<option value='latin-america'>Latin America</option>" +
    "<option value='north-america'>Other North America</option>" +
    "</select>"},
  {qID: 6, resultContent: "At home I speak ", questionContent: "Select which language you speak at home:",
    input: "<select id='language-select' name='answer[language]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='english'>English only</option>" +
    "<option value='spanish'>Spanish</option>" +
    "<option value='indo-european'>Other Indo-European</option>" +
    "<option value='asian-islander'>Asian/Pacific Islander</option>" +
    "<option value='other'>Other</option>" +
    "</select>"},
  {qID: 7, resultContent: "My education level is ", questionContent: "Select your education Level: ", input: "<select id='education-select-adult' name='answer[education]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='8th-grade'>None thru 8th grade</option>" +
    "<option value='11th-grade'>9th - 12th grade, no diploma</option>" +
    "<option value='high-school'>High school graduate (or equivalent)</option>" +
    "<option value='some-college'>Some college, no degree</option>" +
    "<option value='associates'>Associate's degree</option>" +
    "<option value='bachelors'>Bachelor's degree</option>" +
    "<option value='masters'>Master's degree</option>" +
    "<option value='professional'>Professional school degree</option>" +
    "<option value='doctoral'>Doctorate degree</option>" +
    "</select>"},
  {qID: 8, resultContent: "I am currently ", questionContent: "Select your employment status: ", input: "<select id='employment-select' name='answer[employment]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='employed'>Employed</option>" +
    "<option value='unemployed'>Unemployed</option>" +
    "<option value='military'>Active Duty Military</option>" +
    "<option value='not-employed'>Not in the labor force</option>" +
    "</select>"},
  {qID: 9, resultContent: "My annual household income is ", questionContent: "Select your annual household income: ",
    input: "<select id='income-select' name='answer[income]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='under25'>Less than $25,000</option>" +
    "<option value='25to50'>$25,000 to $49,999</option>" +
    "<option value='50to75'>$50,000 to $74,999</option>" +
    "<option value='75to100'>$75,000 to $99,999</option>" +
    "<option value='100to125'>$100,000 to $124,999</option>" +
    "<option value='125to150'>$125,000 to $149,999</option>" +
    "<option value='150to200'>$150,000 to $199,999</option>" +
    "<option value='over200'>$200,000 or more</option>" +
    "</select>"},
  {qID: 10, resultContent: "I currently ", questionContent: "I currently: ",
    input: "<select id='tenure-select' name='answer[tenure]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='own'>Own</option>" +
    "<option value='rent'>Rent</option>" +
    "</select>"},
  {qID: 11, resultContent: "I live in a ", questionContent: "I live in a: ",
    input: "<select id='housing-select-adult' name='answer[housing]'><option value='' disabled selected>Choose your option</option> " +
    "<option value='1-unit-detached'>one-family house detached from any other house</option>" +
    "<option value='1-unit-attached'>one-family house attached to one or more houses</option>" +
    "<option value='2-apts'>building with 2 apartments</option>" +
    "<option value='3-apts'>building with 3 or 4 apartments</option>" +
    "<option value='5-apts'>building with 5 to 9 apartments</option>" +
    "<option value='10-apts'>building with 10 to 19 apartments</option>" +
    "<option value='20-apts'>building with 20+ apartments</option>" +
    "<option value='mobile'>mobile home</option>" +
    "<option value='etc'>boat, RV, van, etc.</option>" +
    "</select>"},
  {qID: 12, resultContent: "My marital status is ", questionContent: "Select your marital status", input: "<select id='marital-status-select' name='answer[maritalStatus]'>" +
    "<option value='' disabled selected>Choose your option</option>" +
    "<option value='never-married'>Never Married</option>" +
    "<option value='married'>Currently Married</option>" +
    "<option value='divorced'>Divorced</option>" +
    "<option value='widowed'>Widowed</option>" +
    "</select>"},
  ];


// questionsArray.forEach(function(question) {
//   Question.create(question, function(err, question2) {
//     if (err) throw err;
//   });
// });



module.exports = Question;