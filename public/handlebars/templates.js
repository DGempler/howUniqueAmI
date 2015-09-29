var indexScreen = Handlebars.compile(
      '<div class="container">' +
        '<br><br>' +
        '<h1 class="header center grey-text">Find Out How UniQue You Really Are!</h1>' +
        '<div class="row center">' +
          '<h5 class="header col s12 light">Start by answering questions and hit “How unique am I?” whenever you’re ready! The more questions you answer, the more accurate your result will be!</h5>' +
          '<h5 class="header col s12 light">Login via <a>facebook</a> or <a>twitter</a> to get instant results!</h5>' +
        '</div>' +
        '<div class="row center">' +
          '<a href="/questions" class="start-button btn-large waves-effect waves-light cyan lighten-1">Get Started</a>' +
        '</div>' +
        '<br><br>' +
      '</div>');

var createQuestion = Handlebars.compile(
'<div class="container center">' +
'<form id="question-form" data-MongID={{_id}} action="questions/{{_id}}/answers" method="POST">' +
'  <label class="header col s6 light">' +
'    {{questionContent}}' +
'  </label>' +
'<div class="input-field">' +
'    {{{input}}}' +
'</div>' +
'    <br />' +
'    <a href="/skip" id="skip-button" class="btn-large waves-effect waves-light cyan lighten-1">Skip</a>' +
'    <a href="/back" id="back-button" class="btn-large waves-effect waves-light cyan lighten-1">Back</a>' +
'    <button type="submit" id="next-button" class="btn-large waves-effect waves-light cyan lighten-1">Next</button><br/><br/>' +
'    <a href="/unique" class="unique-button">' +
'      <img src="/images/logo_sm.png" />' +
'    </a>' +
'</form></div>');

var editAnswer = Handlebars.compile(
'<form class="edit-answer-form" data-qMongId={{_id}} action="questions/{{_id}}/answers" method="POST">' +
'  <label class="header col s12 light">' +
'    {{questionContent}}' +
'  </label>' +
'<div class="input-field">' +
'    {{{input}}}' +
'</div>' +
'    <a href="/cancel" class="cancel-button btn-large waves-effect waves-light cyan lighten-1">Cancel</a>' +
'    <button type="submit" class="submit-edit-button btn-large waves-effect waves-light cyan lighten-1">Submit Changes</button>' +
'</form>');


var loginMenu = Handlebars.compile(
'<li>' +
'    <div class="center">' +
'      <form id="login-form" method="GET" action="/login">' +
'        <br/>' +
'        <div class="input-field">' +
'          <input type="email" name="user[email]" id="email" placeholder="Email" class="left-align" required autofocus/>' +
'        </div>' +
'        <br/>' +
'        <div class="input-field">' +
'          <input type="password" name="user[password]" id="password" placeholder="Password" class="left-align"required/>' +
'        </div><br/>' +
'        <div>' +
'          <button width="100%" type="submit" id="login-button" name="action" class="btn waves-effect waves-light cyan lighten-1">Log in</button>' +
'        </div>' +
'      </form></li><br/>' +
'    </div>' +
'  <li><a class="center" id="signup-link" href="/signup">Sign up</a></li>');
/*
  '<li><form id="login-form" method="GET" action="/login">' +
  '<div class="input-field">' +
  '<input type="email" name="user[email]" id="email" placeholder="Email" required autofocus/>' +
  '</div><br/>' +
  '<div class="input-field">' +
  '<input type="password" name="user[password]" id="password" placeholder="Password" required/>' +
  '</div><br/>' +
  '<button type="submit" id="login-button" class="btn-large waves-effect waves-light cyan lighten-1">Log in</button>' +
  '</form></li><br/>' +
  '<li><a id="signup-link" href="/signup">Sign up</a></li>');*/


var userAccount = Handlebars.compile(
'  <div class="container" id="user-account">' +
'    <br><br>' +
'    <h1 class="header center grey-text">Your Unique Account</h1>' +
'    <div class="row center">' +
'      <a id="user-edit-delete" href="/users/edit">Edit/Delete your user profile</a><br />' +
'       <br><br>' +
'      <a id="clear-answers" href="/answers/delete">Clear all answers</a><br />' +
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
'     <div class="row center" data-qId={{question.qID}} id="qId{{question.qID}}">' +
'      <h5 class="result-content header col s12 light">{{question.resultContent}}</h5>' +
'      <h5 class="answer header col s12 light">{{answer}}</h5>' +
'      <a href="/delete" data-deleteId={{_id}} data-qId={{question.qID}} class="delete-answer-button btn-large waves-effect waves-' +
'        light cyan lighten-1">Remove Answer</a>' +
'      <a href="/edit" data-editId={{_id}} data-qId={{question.qID}} class="edit-answer-button btn-large waves-effect waves-light ' +
'         cyan lighten-1">Edit Answer</a>' +
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
'   <a href="/questions" class="start-button btn-large waves-effect waves-light cyan lighten-1">Get Started</a>' +
'   </div></div>');

var loggedInMenuHTML = Handlebars.compile(
  '<li class="logged-in-links"><a class="start-button" href="/questions">UniQ\'s</a></li>' +
  '<li class="logged-in-links"><a class="unique-button" href="/unique">My UniQueness</a></li>' +
  '<li class="logged-in-links"><a id="my-account" href="/users">My Profile</a></li>' +
  '<li class="logged-in-links"><a id="logout" href="/logout">Logout</a></li>');

var editUserAccount = Handlebars.compile(
' <div class="container center">' +
' <h5 class="header col s12 light">Edit your profile:</h5><br/>' +
' <form id="edit-account-form" method="POST" action="/users/update">' +
'   <input type="hidden" value={{email}} id="current-email"/>' +
'   <div class="input-field">' +
'     <label for="email" class="active">Email: </label><input type="email" name="user[email]" id="email" value={{email}}/><br/>' +
'   </div>' +
'   <div class="input-field">' +
'     <label for="current-password">Current Password (required): </label><input type="password" name="current-password" id="current-password" required/><br/><br/>' +
'   </div>' +
'   <div class="input-field">' +
'     <label for="password">New Password: </label><input type="password" name="password" id="password"/><br/>' +
'   </div>' +
'   <div class="input-field">' +
'     <label for="confirm-password">Confirm New Password: </label><input type="password" name="confirm-password" id="confirm-password"/><br/>' +
'   </div>' +
'   <button type="submit" class="btn-large waves-effect waves-light cyan lighten-1">Submit Changes</button>' +
' </form>' +
' <br/><br/>' +
' <h5 class="header col s12 light">Delete your account:</h5><br/>' +
' <form id="delete-account-form" method="POST" action="/users/delete">' +
'  <div class="input-field">' +
'   <label for="delete-password">Current Password: (required)</label><input type="password" name="delete-password" id="delete-password" required/></label><br/>' +
'  </div>' +
'   <button type="submit" class="btn-large waves-effect waves-light cyan lighten-1">Delete Account</button>' +
' </form>' +
'</div>');


/*
displaySingleResult = Handlebars.compile(
'     <div class="row center">' +
'      <h5 class="header col s12 light">{{question.resultContent}}{{answer}}</h5>' +
'      <a href="/delete" data-deleteId={{_id}} class="delete-answer-button btn-large waves-effect waves-' +'light cyan lighten-1">Remove Answer</a>' +
'      <a href="/edit" data-editId={{_id}} data-qId={{question.qID}} class="edit-answer-button btn-large waves-effect waves-light ' +'cyan lighten-1">Edit Answer</a>' +
'      <br><br>' +
'     </div>');
*/


