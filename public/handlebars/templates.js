var createQuestion = Handlebars.compile(
'<form action="questions/{{_id}}/answers" method="POST">' +
'  <label class="header col s12 light">' +
'    {{questionContent}}' +
'    {{{input}}}' +
'  </label>' +
'    <br />' +
'    <a href="/skip" id="skip-button" class="btn-large waves-effect waves-light blue">Skip</a>' +
'    <a href="/unique" id="unique-button">' +
'      <img src="/images/logo_sm" />' +
'    </a>' +
'    <a href="/back" id="back-button" class="btn-large waves-effect waves-light blue">Back</a>' +
'    <button type="submit" id="submit-button" class="btn-large waves-effect waves-light blue">Next</button>' +
'</form>');

var loginMenu = Handlebars.compile(
  '<li><form id="login-form" method="GET" action="/login">' +
  '<div class="input-field">' +
  '<input type="email" name="user[email]" id="email" placeholder="Email" required/>' +
  '</div><br/>' +
  '<div class="input-field">' +
  '<input type="password" name="user[password]" id="password" placeholder="Password" required/>' +
  '</div><br/>' +
  '<button type="submit" id="login-button" class="btn-large waves-effect waves-light blue">Log in</button>' +
  '</form></li><br/>' +
  '<li><a id="signup-link" href="/signup">Sign up</a></li>');

/*
    {{#if localsUser}}
    <a href="/posts/new">Add a Post</a><br />
    <a href="/logout">Logout</a><br />
    <a href="/users/{{localsUser._id}}">My profile</a>
    {{else}}
    <a href="/login">Login</a><br />
    <a href="/signup">Sign Up</a><br />
    {{/if}}*/