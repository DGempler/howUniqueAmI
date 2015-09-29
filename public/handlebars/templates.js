var indexScreen = Handlebars.compile(
      '<div class="container center">' +
        '<br><br>' +
        '<h1 class="header center black-text">Find Out How UniQue You Really Are!</h1>' +
        '<div class="row center">' +
          '<h5 class="header col s12 light">Start by answering questions and click the UniQue logo whenever you’re ready! The more questions you answer, the more unique your result will be!</h5>' +
          '<h5 class="header col s12 light">Login via <a>facebook</a> or <a>twitter</a> to get instant results!</h5>' +
        '</div>' +
        '<div class="row center">' +
          '<a href="/questions" class="start-button btn-large waves-effect waves-light cyan lighten-1">Get Started</a>' +
        '</div>' +
'       {{#if loggedIn}}' +
'    <a href="/unique" class="unique-button">' +
'      <img width="83px" height="78px" src="/images/logo_sm.png" />' +
'    </a>' +
'       {{/if}}' +
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
'      <img width="83px" height="78px" src="/images/logo_sm.png" />' +
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
'    <h1 class="header center">Your Unique Account</h1>' +
'    <div class="row center">' +
'      <a id="user-edit-delete" href="/users/edit">Edit/Delete your user profile</a><br />' +
'       <br><br>' +
'      <a id="clear-answers" href="/answers/delete">Clear all answers</a><br />' +
'    </div>' +
'    <div class="row center">' +
'     <a href="/unique" class="unique-button">' +
'       <img width="83px" height="78px" src="/images/logo_sm.png" />' +
'      </a>' +
'    </div>' +
'    <br><br>' +
'  </div>');


var displayResults = Handlebars.compile('<div class="section no-pad-bot" id="result-container">' +
'<div class="container">' +
' <br><br>' +
'   <h1 class="header center">Your Uniqueness Results!</h1>' +
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
'     <label for="email" class="active">Email: </label><input type="email" name="user[email]" id="email" value={{email}} /><br/>' +
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

var coppaPage = Handlebars.compile(
'<p>Required by COPPA (15 USC 6501-6506)</p>' +
'<p>Q: What is the COPPA?</p>' +
'<p>A: The Children\'s Online Privacy Protection Act of 1998 (COPPA) governs the online collection of personal information from children under 13.</p>' +
'<p>Q: What kind of information is collected?</p>' +
'<p>A: The web site asks that users enter first and last names to discover how common or uncommon they are. The user may enter their own name, or anyone else\'s name. For statistical purposes we track the number of searches and what names were searched for by an individual user. A typical user will search a number of different names (themselves, friends, family, celebrities) and determining which search was their name would be difficult. However, it is conceivable that a first and last name of a user could be discovered.</p>' +
'<p>The web site also allows users to enter their e-mail address for the purpose of notifying users of new features of this web site, or new web sites created by the operator of this site.</p>' +
'<p>Q: What kind of protections are there for children under 13?</p>' +
'<p>A: Before a user may start their first search, they must indicate whether they are under 13. If a child indicates that they are under 13, all tracking of searches stops. Any search entered by the child is displayed, then the record of the name searched for is immediately discarded (as opposed to being saved for statistical purposes). No names entered by a child under 13 are stored.</p>' +
'<p>The web site does not allow children under 13 to enter their e-mail address.</p>' +
'<p>Q: With whom do you share your data?</p>' +
'<p>A: We do not share search data of individual users or e-mail addresses with anyone, nor do we intend to start.</p>' +
'<p>We do allow users to look at statistics based on the aggregate of all searches. Information such as the most popular name searched for by all users is available. There is no way to single out the information of one particular user from this data.</p>');