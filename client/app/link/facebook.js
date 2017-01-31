  window.fbAsyncInit = function() {
    FB.init({
      appId      : '388576431479555',
      xfbml      : true,
      version    : 'v2.8'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();

      // document.getElementById('status').innerHTML =
      //   'Welcome to Around80!';
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  function checkLoginState() {
    console.log('in login state')
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  function isLoggedIn(cb) {
    console.log('checking login'); 
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        cb(null, response.authResponse.accessToken);
      } else {
        cb(true, null);
      }
    });
  }



  function testAPI() {
    //console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      //console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Welcome to Around 80, ' + response.name + '!';
    });
  }