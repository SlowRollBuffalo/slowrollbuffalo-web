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
                </section>

            <!-- Main -->
                <section id="main" class="container">

                    <section class="box special">
                        <header class="major">
                       		
                       		<label class="dark">First Name</label>
							<input id="checkin-first" type="text"></input>
							
							<label class="dark">Last Name</label>
							<input id="checkin-last" type="text"></input>
							
							<label class="dark">Email</label>
							<input id="checkin-email" type="text"></input>

							<i>Please read the below terms, and if you accept, click the check box below.</i>
							<hr/>
							<div id="checkin-legal-terms">
								<center><img src="static/gears.svg"></img></center>
							</div></br>
							<hr/>

							<input id="checkin-accepts-terms" type="checkbox" value=""></input>
							<label for="checkin-accepts-terms">I Accept the above legal terms</label>
							<br/>
							<br/>
							
							<div id="checkin-bad-accept-terms">You must accept the terms to continue.</div>
							
							<br/>

							<button id="checkin-submit" class="small">Checkin!</button>
						</header>
					</section>

				</section>
		</div>

		<script src="static/js/jquery.min.js"></script>
		<script src="static/jquery.sha256.js"></script>
		<script src="static/js/site.js"></script>
		<script>

		$(document).ready(function() {

			$('#checkin-submit').on('click', function() {
				$('#checkin-bad-accept-terms').show();
			});

			$.ajax({
				url: '/api/users/legal',
				type: 'GET',
				success: function(resp) {
					$('#checkin-legal-terms').html(resp.legal_notice);
				},
				error: function() {
					// herm ...
				}
			});

			$('#checkin-accepts-terms').change(function() {
			    if(this.checked) {
			    	$('#checkin-submit').off('click');
			        $('#checkin-submit').on('click', function() {
			        	$.ajax({
			        		url: '/checkin',
			        		type: 'POST',
			        		success: function(resp) {
			        			alert("You've been checked in!  Enjoy the ride!");
			        		},
			        		error: function(resp) {
			        			// herm ...
			        		}
			        	})
			        });
			    }
			});
		});

		</script>

	</body>
</html>
