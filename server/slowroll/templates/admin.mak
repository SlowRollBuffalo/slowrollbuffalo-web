<html>
<head>

	<title>Slow Roll Buffalo - Admin</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="static/css/main.css" />
    <link rel="stylesheet" href="static/css/site.css" />
    <link rel="stylesheet" href="static/css/reveal.css" />

    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" />

</head>
<body class="landing">

	<div id="page-wrapper">

		<!-- Header -->
        <header id="header" class="alt">
            <h1>SlowRoll: Buffalo</h1>
        </header>

        <!-- Banner -->
        <section id="banner" class="admin-banner">
            <h2>SlowRoll: Buffalo</h2>
            <p>Bicycle with neighbors through the city of good neighbors.</p>
            <!--<ul class="actions">
                <li><a href="#" class="button special">Sign Up</a></li>
                <li><a href="#" class="button">Learn More</a></li>
            </ul>
            -->
        </section>
		

		<!-- Races -->
		<section id="main" class="container">

			<!--<div class="page-nav">-->
			<section id="admin-nav" class="box special features">
				<div class="page-nav-link-wrapper"><a id="page-nav-link-rides" class="page-nav-link">Rides</a></div>
				<div class="page-nav-link-wrapper"><a id="page-nav-link-partners" class="page-nav-link">Partners</a></div>
				<div class="page-nav-link-wrapper"><a id="page-nav-link-users" class="page-nav-link">Users</a></div>
				<div class="page-nav-link-wrapper"><a id="page-nav-link-settings" class="page-nav-link">Settings</a></div>
				<div class="page-nav-link-wrapper"><a id="page-nav-link-logout" class="page-nav-link">Logout</a></div>
			</section>
			<!--</div>-->

			<section id="page-rides" class="page box special features">
				<h2>Rides</h2>
			    <div class="row2">
					<div class="table-wrapper" style="width: 100%;">
					    <div class=""><a id="open-new-ride-modal" class="new-link"><i class="fa fa-plus"></i></a></div>
						<div id="rides-list"></div>
					</div>
			    </div>
			</section>
			
			<section id="page-new-ride" class="page box special features">
				<div class="row2">
					<div style="width: 100%;">
						<h3>Create a new Ride</h3>
						<div id="new-ride-bad-inputs">Mising/Invalid Inputs</div>
						<label>Ride Name</label>
						<input id="new-ride-title" type="text"></input>

						<label>Description</label>
						<textarea id="new-ride-description" ></textarea>
						
						<label>Ride Date</label>
						<input id="new-ride-ride_datetime" readonly></input>
						
						<label>Address</label>
						<input id="new-ride-address_0" type="text"></input>
						<label>City</label>
						<input id="new-ride-city" type="text"></input>
						<label>State</label>
						<input id="new-ride-state" type="text"></input>
						<label>Zipcode</label>
						<input id="new-ride-zipcode" type="text"></input>
						<label>Ride Sponsor</label>
						<select id="new-ride-sponsor_id"></select>
						</br>
						<button id="cancel-new-ride" class="right cancel-button modal-new-ride-cancel">Cancel</button>
						<button id="create-new-ride" class="left create-button">Create Ride!</button>
					</div>
				</div>
			</section>

			<section id="page-partners" class="page box special features">
				<h2>Partners</h2>
			    <div class="row2">
					<div class="table-wrapper" style="width: 100%;">
					    <div class=""><a id="open-new-partner-modal" class="new-link"><i class="fa fa-plus"></i></a></div>
						<div id="partners-list"></div>
					</div>
			    </div>
			</section>

			<section id="page-new-partner" class="page box special features">
				<div class="row2">
					<div style="width: 100%;">
						<h3>Create a new Partner</h3>
						<div id="new-ride-bad-inputs">Mising/Invalid Inputs</div>
						<label>Name</label>
						<input id="new-partner-name" type="text"></input>
						<label>Description</label>
						<textarea id="new-partner-description" ></textarea>
						<label>Notification Text</label>
						<textarea id="new-partner-notification_text" ></textarea>
						<label>Address</label>
						<input id="new-partner-address_0" type="text"></input>
						<label>City</label>
						<input id="new-partner-city" type="text"></input>
						<label>State</label>
						<input id="new-partner-state" type="text"></input>
						<label>Zipcode</label>
						<input id="new-partner-zipcode" type="text"></input>

						<center>
							<button id="partner-geo-fence-button">Draw GeoFence</button>
							<div id="partner-geofence-latlng"></div>
						</center>
						<div id="new-partner-bad-geofence">Missing Geo Fence</div>
						<div id="partner-geofence-map"></div>
						
						<button id="cancel-new-partner" class="right cancel-button modal-new-partner-cancel">Cancel</button>
						<button id="create-new-partner" class="left create-button">Create Partner!</button>

					</div>
				</div>
			</section>

			<section id="page-users" class="page box special features">
				<h2>Users</h2>
			    <div class="row2">
					<div class="table-wrapper" style="width: 100%;">
					    <!--<div class=""><a id="open-new-partner-modal" class="new-link"><i class="fa fa-plus"></i></a></div>-->
					    <div id="user-settings-modal" class="reveal-modal" data-reveal aria-labelledby="User Settings" aria-hidden="true" role="dialog">
					    	<h2>Users Settings</h2>
					    	<div id="user-settings-content"></div>
					    	<button class="right cancel-button update-user-settings-close">Cancel</button>
					    	<button id="update-user-settings-button" class="left create-button">Save</button>
					    </div>
						<div id="users-list"></div>
					</div>
				</div>
			</section>

			<section id="page-settings" class="page box special features">
				<h2>Settings</h2>
			    <div class="row2">
			    	<div class="legal-notice-editor-wrapper">
			    		<h3>Legal Notice</h3>
			    		<i>Note: this is the notice that is agreed to by all users when the register within the app.</i>
						<textarea id="legal-notice"></textarea>
						<button id="legal-notice-update-button">Update Legal Notice</button>
					</div>

				</div>
			</section>
			
		</section>
	</div>

	<!-- Scripts -->
    <script src="static/js/jquery.min.js"></script>
    <script src="static/js/jquery-ui.min.js"></script>
    <!--<script src="static/js/jquery-1.4.4.min.js"></script>-->
    <script src="static/js/jquery.dropotron.min.js"></script>
    <script src="static/js/jquery.scrollgress.min.js"></script>
    <script src="static/js/skel.min.js"></script>
    <script src="static/js/util.js"></script>
    <script src="static/js/main.js"></script>

    <script src="static/js/jquery.reveal.js"></script>
    
	<script src="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js"></script>

	<script src="//cdn.tinymce.com/4/tinymce.min.js"></script>

    <script src="static/js/site.js"></script>

    <script>
        
    	$(document).ready( function() {
    		
    		app.init();

    		app.display_page('rides');

    	})
    </script>

</body>
</html>
