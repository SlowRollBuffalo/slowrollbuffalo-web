<html>
<head>

  <title>SlowRoll - Admin Site</title>

  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
  <link rel="stylesheet" href="static/site.css" type="text/css"/>
 
  <link href="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/css/foundation.min.css" rel="stylesheet" type="text/css" /> 
  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css" />
  <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />

</head>
<body>

  <div class="site">

    <div class="row">
      <div class="large-12 columns">
        <h1>Slow Roll Buffalo</h1>
        <div class="top-nav-bar">
          <div class="right"><a id="logout-link">Logout</a></div>
          <a class="nav-item" href="#/rides">Rides</a> | 
          <a class="nav-item" href="#/partners">Partners</a> | 
          <a class="nav-item" href="#/partner_levels">Partner Levels</a> 
        </div>
      </div>
    </div>

    <div class="row">
      <div class="large-12 columns">
        <div class="site-wrapper">
          <div class="tabs">
            <div id="tab-rides" class="tab">
              <h2>Rides
              <button class="small right" onclick="sr.dialog_create('rides');">New Ride</button>
              </h2>
              <hr></hr>
              <div class="row"><div class="columns large-12">
                <div id="rides-list" class="list"></div>
              </div></div>
            </div>
            <div id="tab-new-ride" class="tab">
            </div>
            <div id="tab-partners" class="tab">
              <h3>Partners</h3>
            </div>
            <div id="tab-new-partner" class="tab">
            </div>
            <div id="tab-partner_levels" class="tab">
              <h3>Partner levels</h3>
            </div>
            <div id="tab-new-partner_levels" class="tab">
            </div>
            <div id="tab-checkins" class="tab">
              <h3>Checkins</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="reveal-modal" id="dialog-new" data-reveal>
      <div id="dialog-new-inner">
      </div>
    </div>

    <div class="reveal-modal" id="dialog-update" data-reveal>
      <div id="dialog-update-inner">
      </div>
    </div>

  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/vendor/jquery.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/vendor/modernizr.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/foundation.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.3/js/foundation/foundation.reveal.min.js"></script>
  <script>
    $(document).foundation();
  </script>

  <script src="static/jquery.sha256.js"></script>
  <script src="static/site.js"></script>
  <script>

    $(document).foundation();

    $(document).ready(function() {

      // link logout link
      $('#logout-link').click(function() { do_logout(); })

      // configure hash changes
      window.onhashchange = sr.service_hash_change;

      // show rides tab
      window.location.hash = '#/rides';
      sr.show_tab('rides');


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
