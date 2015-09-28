var indexScreen = Handlebars.compile(
      '<div class="container">' +
        '<br><br>' +
        '<h1 class="header center grey-text">Find Out How UniQue You Really Are!</h1>' +
        '<div class="row center">' +
          '<h5 class="header col s12 light">Start by answering questions and hit “How unique am I?” whenever you’re ready! The more questions you answer, the more accurate your result will be!</h5>' +
          '<h5 class="header col s12 light">Login via <a>facebook</a> or <a>twitter</a> to get instant results!</h5>' +
        '</div>' +
        '<div class="row center">' +
          '<a href="/questions" class="start-button btn-large waves-effect waves-light blue">Get Started</a>' +
        '</div>' +
        '<br><br>' +
      '</div>');

var createQuestion = Handlebars.compile(
'<form id="question-form" data-MongID={{_id}} action="questions/{{_id}}/answers" method="POST">' +
'  <label class="header col s12 light">' +
'    {{questionContent}}' +
'  </label>' +
'<div class="input-field">' +
'    {{{input}}}' +
'</div>' +
'    <br />' +
'    <a href="/unique" class="unique-button">' +
'      <img src="/images/logo_sm.png" />' +
'    </a>' +
'    <a href="/skip" id="skip-button" class="btn-large waves-effect waves-light blue">Skip</a>' +
'    <a href="/back" id="back-button" class="btn-large waves-effect waves-light blue">Back</a>' +
'    <button type="submit" id="next-button" class="btn-large waves-effect waves-light blue">Next</button>' +
'</form>');

var editAnswer = Handlebars.compile(
'<form class="edit-answer-form" data-qMongId={{_id}} action="questions/{{_id}}/answers" method="POST">' +
'  <label class="header col s12 light">' +
'    {{questionContent}}' +
'  </label>' +
'<div class="input-field">' +
'    {{{input}}}' +
'</div>' +
'    <a href="/cancel" class="cancel-button btn-large waves-effect waves-light blue">Cancel</a>' +
'    <button type="submit" class="submit-edit-button btn-large waves-effect waves-light blue">Submit Changes</button>' +
'</form>');


var loginMenu = Handlebars.compile(
  '<li><form id="login-form" method="GET" action="/login">' +
  '<div class="input-field">' +
  '<input type="email" name="user[email]" id="email" placeholder="Email" required autofocus/>' +
  '</div><br/>' +
  '<div class="input-field">' +
  '<input type="password" name="user[password]" id="password" placeholder="Password" required/>' +
  '</div><br/>' +
  '<button type="submit" id="login-button" class="btn-large waves-effect waves-light blue">Log in</button>' +
  '</form></li><br/>' +
  '<li><a id="signup-link" href="/signup">Sign up</a></li>');

var userAccount = Handlebars.compile(
'  <div class="container">' +
'    <br><br>' +
'    <h1 class="header center grey-text">Your Unique Account</h1>' +
'    <div class="row center">' +
'      <a id="user-edit-delete" href="/users/edit">Edit/Delete your user profile</a><br />' +
'    </div>' +
'    <div class="row center">' +
'     <a href="/unique" class="unique-button">' +
'       <img src="/images/logo_sm.png" />' +
'      </a>' +
'    </div>' +
'    <br><br>' +
'  </div>');


var displayResults = Handlebars.compile('<div class="section no-pad-bot" id="result-container">' +
'<div class="container">' +
' <br><br>' +
'   <h1 class="header center grey-text">Your Uniqueness Results!</h1>' +
'   {{#each array}}' +
'     <div class="row center" data-qId={{question.qID}}>' +
'      <h5 class="result-content header col s12 light">{{question.resultContent}}</h5>' +
'      <h5 class="answer header col s12 light">{{answer}}</h5>' +
'      <a href="/delete" data-deleteId={{_id}} class="delete-answer-button btn-large waves-effect waves-' +'light blue">Remove Answer</a>' +
'      <a href="/edit" data-editId={{_id}} data-qId={{question.qID}} class="edit-answer-button btn-large waves-effect waves-light ' +'blue">Edit Answer</a>' +
'      <br><br>' +
'     </div>' +
'   {{/each}}' +
' </div>' +
'</div>');

var questionLinks = Handlebars.compile(
  '{{#each qLinks}}' +
    '{{#if @first}}' +
    '<a href=/{{@key}} class="qLinks" data-qId={{@key}}>  {{this}}  </a>' +
    '{{else}}' +
    '•<a href=/{{@key}} class="qLinks" data-qId={{@key}}>  {{this}}  </a>' +
    '{{/if}}' +
  '{{/each}}');

var noQuestionsAnswered = Handlebars.compile(
'<div class="container center" id="no-questions-banner">' +
'   <br><br>' +
"   <h5 class='result-content header col s12 light'>That's because you haven't answered any questions yet!</h5>" +
'   <div class="row center">' +
'   <a href="/questions" class="start-button btn-large waves-effect waves-light blue">Get Started</a>' +
'   </div></div>');

var loggedInMenuHTML = Handlebars.compile(
  '<li class="logged-in-links"><a class="start-button" href="/questions">UniQ\'s</a></li>' +
  '<li class="logged-in-links"><a class="unique-button" href="/unique">My UniQueness</a></li>' +
  '<li class="logged-in-links"><a id="my-account" href="/users">My Profile</a></li>' +
  '<li class="logged-in-links"><a id="logout" href="/logout">Logout</a></li>');
/*
displaySingleResult = Handlebars.compile(
'     <div class="row center">' +
'      <h5 class="header col s12 light">{{question.resultContent}}{{answer}}</h5>' +
'      <a href="/delete" data-deleteId={{_id}} class="delete-answer-button btn-large waves-effect waves-' +'light blue">Remove Answer</a>' +
'      <a href="/edit" data-editId={{_id}} data-qId={{question.qID}} class="edit-answer-button btn-large waves-effect waves-light ' +'blue">Edit Answer</a>' +
'      <br><br>' +
'     </div>');
*/


