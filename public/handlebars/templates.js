var createFormTmpl = Handlebars.compile('<form action="/places" method="POST" id="create-form">' +
  '<div class="form-group">' +
  '<label for="name">Address: </label>' +
  '<input type="text" class="form-control" name="place[address]" id="address" autofocus>' +
  '</div>' +
  '<div class="form-group">' +
  '<label for="lat">Latitude (Optional): </label>' +
  '<input type="text" class="form-control" name="place[lat]" id="lat">' +
  '<label for="long">Longitude (Optional): </label>' +
  '<input type="text" class="form-control" name="place[long]" id="long">' +
  '</div>' +
  '<input type="submit" value="Add" class="btn btn-lg btn-success">' +
  '</form>');

var createQuestion = Handlebars.compile('');

{{#if localsUser}}
<form action="/users/{{" method="POST"></form>




    {{#if localsUser}}
    <a href="/posts/new">Add a Post</a><br />
    <a href="/logout">Logout</a><br />
    <a href="/users/{{localsUser._id}}">My profile</a>
    {{else}}
    <a href="/login">Login</a><br />
    <a href="/signup">Sign Up</a><br />
    {{/if}}