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

var userAccount = Handlebars.compile(
'<div class="section no-pad-bot" id="index-banner">' +
'  <div class="container">' +
'    <br><br>' +
'    <h1 class="header center grey-text">Your Unique Account</h1>' +
'    <div class="row center">' +
'      <a href="/users/{{user._id}}/edit">Edit/Delete your user profile</a><br />' +
'    </div>' +
'    <div class="row center">' +
'      <h5 class="header col s12 light">Your Unique History:</h5>' +
'      <ul>' +
'        {{#each user.questions}}' +
'          <li>' +
'            <h5><a href="/posts/{{this._id}}">{{this.title}}</a></h5>' +
'            <p>{{this.body}}</p><br />' +
'            <a href="/posts/{{this._id}}/comments">See Comments</a><br />' +
'            {{#if isMatch}}' +
'            <a href="/posts/{{this._id}}/edit">Edit Post</a><br/>' +
'            <form method="POST" action="/posts/{{this._id}}?_method=delete">' +
'              <input type="submit" value="Delete Post">' +
'            </form>' +
'            {{/if}}' +
'          </li>' +
'        {{/each}}' +
'    </div>' +
'    <br><br>' +
'  </div>' +
'</div>');