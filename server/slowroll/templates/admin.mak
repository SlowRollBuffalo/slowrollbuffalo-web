<html>
<head>

	<title>Slow Roll Buffalo - Admin</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="static/css/main.css" />
    <link rel="stylesheet" href="static/css/site.css" />
    <link rel="stylesheet" href="static/css/reveal.css" />

    
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

			<div class="page-nav">
				<div class="page-nav-link-wrapper"><a id="page-nav-link-rides" class="page-nav-link">Rides</a></div>
				<div class="page-nav-link-wrapper"><a id="page-nav-link-partners" class="page-nav-link">Partners</a></div>
				<div class="page-nav-link-wrapper"><a id="page-nav-link-users" class="page-nav-link">Users</a></div>
				<div class="page-nav-link-wrapper"><a id="page-nav-link-settings" class="page-nav-link">Settings</a></div>
				<div class="page-nav-link-wrapper"><a id="page-nav-link-logout" class="page-nav-link">Logout</a></div>
			</div>

			<section id="page-rides" class="page box special features">
				<h2>Rides</h2>
			    <div class="row2">
					<div class="table-wrapper" style="width: 100%;">
					    <div class=""><a id="open-new-ride-modal" class="new-link"><i class="fa fa-plus"></i></a></div>
						<div id="rides-list"></div>
						<div class="reveal-modal" id="modal-new-ride">
							<h3>Create a new Ride</h3>
							<label>Ride Name</label>
							<input id="new-ride-title" type="text"></input>
							<label>Description</label>
							<textarea id="new-ride-description" ></textarea>
							<label>Ride Date</label>
							<input id="new-ride-ride_datetime" readonly></input>
							<label>Address</label>
							<input id="new-ride-address" type="text"></input>
							<label>City</label>
							<input id="new-ride-city" type="text"></input>
							<label>State</label>
							<input id="new-ride-state" type="text"></input>
							<label>Zipcode</label>
							<input id="new-ride-zipcode" type="text"></input>
							</br>
							<button id="" class="right cancel-button modal-new-ride-cancel">Cancel</button>
							<button id="create-new-ride" class="left create-button">Create Ride!</button>
							
						</div>
						<!--
						<table>
							<thead>
								<tr>
									<td>Date</td>
									<td>Location</td>
									<td>Sponsor</td>
									<td></td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>July 20</td>
									<td>Big Ditch Brewing - 55 E. Huron St.</td>
									<td>Bid Ditch Brewing</td>
									<td>
										<a class="edit-link" href=""><i class="fa fa-pencil"></i></a>
										<a class="trash-link" href=""><i class="fa fa-trash"></i></a>
									</td>
								</tr>
								<tr>
									<td>July 20</td>
									<td>Big Ditch Brewing (55 E. Huron St.)</td>
								</tr>
								<tr>
									<td>July 20</td>
									<td>Big Ditch Brewing (55 E. Huron St.)</td>
								</tr>
								<tr>
									<td>July 20</td>
									<td>Big Ditch Brewing (55 E. Huron St.)</td>
								</tr>
								<tr>
									<td>July 20</td>
									<td>Big Ditch Brewing (55 E. Huron St.)</td>
								</tr>
								<tr>
									<td>July 20</td>
									<td>Big Ditch Brewing (55 E. Huron St.)</td>
								</tr>
								<tr>
									<td>July 20</td>
									<td>Big Ditch Brewing (55 E. Huron St.)</td>
								</tr>
							</tbody>
						</table>
						-->
					</div>
			    </div>
			</section>

			
			<section id="rides" class="page box special features">
			    <div class="row">
					<div class="table-wrapper" style="width: 100%;">
						<table>
							<thead>
								<tr>
									<td>Date</td>
									<td>Location</td>
									<td>Sponsor</td>
									<td></td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>July 20</td>
									<td>Big Ditch Brewing - 55 E. Huron St.</td>
									<td>Bid Ditch Brewing</td>
									<td>
										<a class="edit-link" href=""><i class="fa fa-pencil"></i></a>
										<a class="trash-link" href=""><i class="fa fa-trash"></i></a>
									</td>
								</tr>
							</tbody>
						</table>
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
    
    <script src="static/js/site.js"></script>

    <script>
        
    	$(document).ready( function() {
    		sr.init();

    		sr.display_page('rides');

    		/*
    		console.log('modal reveal');
    		$('#modal-new-ride').reveal({
    			animation: 'fadeAndPop',
    			animationspeed: 250,
    			closeonbackgroundclick: true,
    			dismissmodalclass: 'modal-new-ride-cancel'
    		});
    		*/
    	})
    </script>

</body>
</html>
