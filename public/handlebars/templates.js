var indexScreen = Handlebars.compile(
      '<div class="container">' +
        '<br><br>' +
        '<h1 class="header center grey-text">Find Out How UniQue You Really Are!</h1>' +
        '<div class="row center">' +
          '<h5 class="header col s12 light">Start by answering questions and hit “How unique am I?” whenever you’re ready! The more questions you answer, the more accurate your result will be!</h5>' +
          '<h5 class="header col s12 light">Login via <a>facebook</a> or <a>twitter</a> to get instant results!</h5>' +
        '</div>' +
        '<div class="row center">' +
          '<a href="/questions" id="start-button" class="btn-large waves-effect waves-light blue">Get Started</a>' +
        '</div>' +
        '<br><br>' +
      '</div>');

var createQuestion = Handlebars.compile(
'<form id="question-form" data-qID={{_id}} action="questions/{{_id}}/answers" method="POST">' +
'  <label class="header col s12 light">' +
'    {{questionContent}}' +
'  </label>' +
'<div class="input-field">' +
'    {{{input}}}' +
'</div>' +
'    <br />' +
'    <a href="/unique" id="unique-button">' +
'      <img src="/images/logo_sm.png" />' +
'    </a>' +
'    <a href="/skip" id="skip-button" class="btn-large waves-effect waves-light blue">Skip</a>' +
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
'  </div>');