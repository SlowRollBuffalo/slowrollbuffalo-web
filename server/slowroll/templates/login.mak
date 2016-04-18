<!DOCTYPE HTML>
<!--
    Alpha by Pixelarity
    pixelarity.com @pixelarity
    License: pixelarity.com/license
-->
<html>
    <head>
        <title>Slow Roll Buffalo</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="static/css/main.css" />
        <link rel="stylesheet" href="static/css/site.css" />
        <link rel="stylesheet" href="static/css/login.css" />
    </head>
    <body class="landing">
        <div id="page-wrapper">

            <!-- Header -->
                <header id="header" class="alt">
                    <h1>SlowRoll: Buffalo</h1>
                </header>

            <!-- Banner -->
                <section id="banner" class="frontpage-banner">
                    <h2>SlowRoll: Buffalo</h2>
                    <p>Bicycle with neighbors through the city of good neighbors.</p>
                    <!--
                    <ul class="actions">
                        
                        <img id="google-icon" src="static/images/googleplay_icon.png"></img>
                        <img id="ios-icon" src="static/images/ios_app_icon.png"></img>
                    </ul>
                    -->
                </section>

            <!-- Main -->
                <section id="main" class="container">

                    <section class="box special">
                        <header class="major">
                        	<h3>Please Login</h3>
                       		<label class="dark">Email</label>
							<input id="login-email" type="text"></input>
							<label class="dark">Password</label>
							<input id="login-password" type="password"></input>
							<div id="login-bad-credentials">Invalid login. Please try again.</div>
							<button id="login-submit" class="small">Login</button>
						</header>
					</section>
				</section>
		</div>

		<script src="static/js/jquery.min.js"></script>
		<script src="static/jquery.sha256.js"></script>
		<script src="static/js/site.js"></script>
		<script>

			$(document).ready(function() {
			
				$('#login-submit').click(function() {
					do_login();
				});
				
				$('#login-email').keyup(function(event) {
					if( event.keyCode == 13 ) {
						do_login();
					}
				});
				
				$('#login-password').keyup(function(event) {
					if( event.keyCode == 13 ) {
						do_login();
					}
				});

			});

			function do_login() {
				var email = $('#login-email').val();
				var password = $('#login-password').val();
				app.login(
					email,
					$.sha256(password),
					function(resp) {
						window.location = '/admin';
					},
					function() {
						$('#login-bad-credentials').show();
					}
				);
			}

			function do_logout() {
				app.logout(
					function() {
					window.location = '/login';
				},
				function() {}
				);
			}

		</script>

	</body>
</html>

<!--
<html>
<head>

  <title>SlowRoll - Login</title>

  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <link href="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/css/foundation.min.css" rel="stylesheet" type="text/css" /> 
  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css" />
  <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />

  <link rel="stylesheet" href="static/css/login.css" type="text/css"/>

</head>
<body>

  <div class="site">

    <div class="row">
      <div class="large-12 columns">
        <div class="login-box">
          <h3>SlowRoll Buffalo</h3>
          <div class="inner-login-box">
            <label>Email</label>
            <input id="login-email" type="text"></input>
            <label>Password</label>
            <input id="login-password" type="password"></input>
            <div id="login-bad-credentials">Invalid login. Please try again.</div>
            <button id="login-submit" class="small right">Login</button>
          </div>
        </div>
      </div>
    </div>

  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/vendor/jquery.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/vendor/modernizr.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/foundation.min.js"></script>
  <script>
    //$(document).foundation();
  </script>

  <script src="static/jquery.sha256.js"></script>
  <script src="static/js/site.js"></script>
  <script>
    $(document).ready(function() {
      $('#login-submit').click(function() {
        do_login();
      });
      $('#login-email').keyup(function(event) {
        if( event.keyCode == 13 ) {
          do_login();
        }
      });
      $('#login-password').keyup(function(event) {
        if( event.keyCode == 13 ) {
          do_login();
        }
      });
    });

    function do_login() {
      var email = $('#login-email').val();
      var password = $('#login-password').val();
      sr.login(
        email,
        $.sha256(password),
        function(resp) {
          window.location = '/admin';
        },
        function() {
          $('#login-bad-credentials').show();
        }
      );
    }

    function do_logout() {
      sr.logout(
        function() {
          window.location = '/login';
        },
        function() {}
      );
    }
    
  </script>

</body>
</html>
-->