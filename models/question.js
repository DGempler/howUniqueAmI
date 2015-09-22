var mongoose = require('mongoose');
var db = require('./index');

var questionSchema = new mongoose.Schema({
  questionContent: {
    type: String,
    unique: true
  },
  ResultContent: {
    type: String,
    unique: true
  },
  input: String,
  ageCategories: [String],
  data: [],
  source: String,
  //necessary?
  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answer"
  }]
});

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;

var questionsArray = [
  {resultContent: "You are ", questionContent: "How old are you? ", input: "<input type='number' class='number-input' min='1' max='122' step='1' id='age-select' name='answer[age]' />", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "Your first name is ", questionContent: "Enter your first name: ", input: "<input class='text-input' id='name-input' type='text' />", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "Enter your birthday: ", input: "<input class='date-input' id='birthday-input' type='date' />", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "Gender: ", input: "<select class='select-input' id='gender-select' name='answer[gender]'>" +
    "<option value='male'>Male</option>" +
    "<option value='female'>Female</option></select>", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "Race: (choose one or more)", input: "<select class='select-input' id='race-select' name='answer[race]' multiple='true'>" +
    "<option value='native'>American Indian or Alaska Native</option>" +
    "<option value='asian'>Asian</option>" +
    "<option value='black'>Black or African American</option>" +
    "<option value='hispanic'>Hispanic</option>" +
    "<option value='islander'>Native Hawaiian or Other Pacific Islander</option>" +
    "<option value='white'>White</option>" +
    "<option value='other'>Other</option>" +
    "</select>", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "Religion: ", input: "<select class='select-input' id='religion-select' name='answer[religion]'>" +
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
    "<option value='none'>No religion</option>" +
    "<option value='other'>Other unclassified</option>" +
    "</select>", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "Education Level: ", input: "<select class='select-input' id='education-select-adult' name='answer[education]'>" +
    "<option value='8th-grade'>None thru 8th grade</option>" +
    "<option value='11th-grade'>9th - 11th grade</option>" +
    "<option value='high-school'>High school graduate</option>" +
    "<option value='some-college'>Some college no degree</option>" +
    "<option value='associates'>Associate's degree</option>" +
    "<option value='bachelors'>Bachelor's degree</option>" +
    "<option value='masters'>Master's degree</option>" +
    "<option value='professional'>Professional degree</option>" +
    "<option value='doctoral'>Doctoral degree</option>" +
    "</select>", ageCategories: ["youth", "adult", "senior"]},
  {resultContent: "", questionContent: "Education Level: ", input: "<select class='select-input' id='education-select-teen' name='answer[education]'>" +
    "<option value='8th-grade'>None thru 8th grade</option>" +
    "<option value='11th-grade'>9th - 11th grade</option>" +
    "<option value='high-school'>High school graduate</option>" +
    "<option value='some-college'>Some college no degree</option>" +
    "<option value='associates'>Associate's degree</option>" +
    "<option value='bachelors'>Bachelor's degree</option>" +
    "</select>", ageCategories: ["teen"]},
  {resultContent: "", questionContent: "Marital Status", input: "<select class='select-input' id='marital-status-select' name='answer[maritalStatus]'>" +
    "<option value='never'>Never Married</option>" +
    "<option value='married'>Married</option>" +
    "<option value='divorced'>Divorced</option>" +
    "<option value='widowed'>Widowed</option>" +
    "</select>",ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "Eye Color: ", input: "<select class='select-input' id='eye-color-select' name='answer[eyeColor]'>" +
    "<option value='blue'>Blue</option>" +
    "<option value='brown'>Brown</option>" +
    "<option value='green'>Green</option>" +
    "<option value='hazel'>Hazel</option>" +
    "</select>",ageCategories: ["teen", "youth", "adult", "senior"]},
    {resultContent: "", questionContent: "Hair Color: ", input: "<select class='select-input' id='hair-color-select' name='answer[hairColor]'>" +
    "<option value='blue'>Blond</option>" +
    "<option value='brown'>Black</option>" +
    "<option value='green'>Brown</option>" +
    "<option value='hazel'>Gray</option>" +
    "</select>",ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "Height: ", input: "Feet: <input type='number' class='number-input' min='4' max='6' step='1' id='height-feet-select' name='answer[height.feet]' />" +
    "Inches: <input type='number' class='number-input' min='0' max='11' step='1' id='height-inches-select' name='answer[height.inches]' />", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "Weight: ", input: "<input type='number' class='number-input' min='80' max='400' step='1' id='weight-select' name='answer[weight]' />", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "Height: ", input: "", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "", input: "", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "", input: "", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "", input: "", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "", input: "", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "", input: "", ageCategories: ["teen", "youth", "adult", "senior"]},
  {resultContent: "", questionContent: "", input: "", ageCategories: ["teen", "youth", "adult", "senior"]},
  ];



