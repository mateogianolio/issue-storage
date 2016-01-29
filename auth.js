(function () {
  'use strict';

  var USERNAME = 'mateogianolio', // github username
      REPO = 'issue-forum', // github repository
      TOKEN = '46ff05f8cb08cc99a4e33dc49afa3bfa7505788e'; // github access token

  // authenticate with github
  window.ghAuth = function () {
    var cookies = getCookies(),
        username = cookies.username,
        password = cookies.password;

    // export API as global
    window.github = new Github({
      username: cookies.username,
      password: cookies.password,
      auth: 'basic'
    });

    var user = window.github.getUser();
    user.show(cookies.username, function (error, user) {
      if (error) {
        // use personal access token if authentication throws error
        window.github = new Github({
          token: TOKEN,
          auth: 'oauth'
        });

        // clear cookies
        setCookie('username', '', 0);
        setCookie('password', '', 0);

        document.querySelector('.login').style.display = 'block';
      } else {
        document.querySelector('.login').style.display = 'none';
      }

      // render
      window.github
        .getIssues(USERNAME, REPO)
        .list({}, window.ghRender);
    });
  };

  // called on login form submit
  window.ghLogin = function (event) {
    event.preventDefault();
    
    var form = document.querySelector('.login'),
        username = form.username.value,
        password = form.password.value;

    if (!username || !password)
      return false;

    setCookie('username', username);
    setCookie('password', password);

    // authenticate
    ghAuth();

    // prevent default event
    return false;
  };
}());