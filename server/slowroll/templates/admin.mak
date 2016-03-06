<html>
<head>

  <title>SlowRoll - Login</title>

  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <link href="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/css/foundation.min.css" rel="stylesheet" type="text/css" /> 
  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css" />
  <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />

  <link rel="stylesheet" href="static/site.css" type="text/css"/>

</head>
<body>

  <div class="site">

    <div class="row">
      <div class="large-12 columns">
        <div class="top-nav-bar">
          <div class="right"><a id="logout-link">Logout</a></div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="large-12 columns">
        <div class="site-wrapper">
          hi
        </div>
      </div>
    </div>

  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/vendor/jquery.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/vendor/modernizr.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/foundation.min.js"></script>
  <script>
    $(document).foundation();
  </script>

  <script src="static/jquery.sha256.js"></script>
  <script src="static/site.js"></script>
  <script>
    $(document).ready(function() {
      $('#logout-link').click(function() { do_logout(); })
    });

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
