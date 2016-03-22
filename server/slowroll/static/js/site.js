
var app = {

	init: function() {
		
		// connect all the pages
		$('#page-nav-link-rides').on('click', function() { app.display_page('rides'); } );
		$('#page-nav-link-partners').on('click', function() { app.display_page('partners'); } );
		$('#page-nav-link-users').on('click', function() { app.display_page('users'); } );
		$('#page-nav-link-settings').on('click', function() { app.display_page('settings'); } );
		$('#page-nav-link-logout').on('click', function() { app.display_page('logout'); } );

		//
		// Rides
		//

		// refresh ride list
		app.models['rides'].refresh();

		// connect creating a new ride modal
		$('#open-new-ride-modal').on('click', function() {
			app.populate_sponsors_list();
			$('#modal-new-ride').reveal({
    			animation: 'fadeAndPop',
    			animationspeed: 250,
    			closeonbackgroundclick: true,
    			dismissmodalclass: 'modal-new-ride-cancel'
    		});
		})

		// connect date picker
		$('#new-ride-ride_datetime').datepicker();

		// connect create new ride button in modal
		$('#create-new-ride').on('click', function() {
			var data = {
				'title': $('#new-ride-title').val(),
				'description': $('#new-ride-description').val(),
				'ride_datetime': $('#new-ride-ride_datetime').val(),
				'address_0': $('#new-ride-address').val(),
				'address_1': '',
				'city': $('#new-ride-city').val(),
				'state': $('#new-ride-state').val(),
				'zipcode': $('#new-ride-zipcode').val(),
				'sponsor_id': $('#new-ride-sponsor-list').val()
			};
			app.actions.create(
				'rides',
				data,
				function() {
					$('#modal-new-ride').trigger('reveal:close');
					app.models['rides'].refresh();
				},
				function() { window.location = '/login'; }
			);
		});

		//
		// Partners
		//

		// refresh the partner list
		app.models['partners'].refresh();

		// init the map for partner geo fence
		app.init_geofence_map();

		// connect creating a new partner modal
		$('#open-new-partner-modal').on('click', function() {
			$('#modal-new-partner').reveal({
    			animation: 'fadeAndPop',
    			animationspeed: 250,
    			closeonbackgroundclick: true,
    			dismissmodalclass: 'modal-new-partner-cancel'
    		});
		})

		// connect date picker
		//$('#new-partner-ride_datetime').datepicker();

		// connect create new partner button in modal
		$('#create-new-partner').on('click', function() {
			var data = {
				'name': $('#new-partner-name').val(),
				'description': $('#new-partner-description').val(),
				'notification_text': $('#new-partner-notification_text').val(),
				'address_0': $('#new-partner-address').val(),
				'address_1': '',
				'city': $('#new-partner-city').val(),
				'state': $('#new-partner-state').val(),
				'zipcode': $('#new-partner-zipcode').val(),
				'fence_top_left_lat': app.geofence.top_left_lat,
				'fence_top_left_lng': app.geofence.top_left_lng,
				'fence_bottom_right_lat': app.geofence.bottom_right_lat,
				'fence_bottom_right_lng': app.geofence.bottom_right_lng,
			};
			app.actions.create(
				'partners',
				data,
				function() {
					$('#modal-new-partner').trigger('reveal:close');
					app.models['partners'].refresh();
				},
				function() { window.location = '/login'; }
			);
		});

		console.log('app.init() complete.');
	},

	login: function(email, password, success, failure) {
        $.ajax({
            url: '/api/users/login',
            type: 'POST',
            data: JSON.stringify({
                email: email,
                password: password,
                platform: 'web'
            }),
            success: function(resp) {success(resp); },
            error: function(resp) { failure(resp); }
        });
    },

    logout: function(success, failure) {
        $.ajax({
            url: '/api/users/logout',
            type: 'POST',
            success: function(resp) { success(resp); },
            error: function(resp) { failure(resp); }
        });
    },

	display_page: function(page) {
		console.log('showing page: "' + page + '"');
		$('.page').hide()
		switch(page) {
			case 'rides':
				$('#page-rides').show();
				app.models['rides'].refresh();
				break;
			case 'partners':
				$('#page-partners').show();
				app.models['partners'].refresh();
				break;
			case 'users':
				$('#page-users').show();
				app.models['users'].refresh();
				break;
			case 'logout':
				app.logout(
					function() { window.location = '/login' },
				 	function() { window.location = '/login' }
				);
			default:
				//window.location = '/login';
				break;
		};
		
	},

	geo_fence: {},

	init_geofence_map: function() {

		// initialize map
        var mainTileLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             attribution: 'Map data © OpenStreetMap contributors',
             minZoom: 4,
             maxZoom: 16
        }),

        map = L.map('partner-geofence-map', {
            center: [42.91, -78.85],
            zoom: 11,
            layers: [
                mainTileLayer
            ]
        });

        map.drawingBox = false;
        map.geoBox = false;

        $('#partner-geo-fence-button').on('click', function (e) {
            map.enableDrawing = true;
            $('.leaflet-container').css('cursor','crosshair','!important');
            if ( map.geoBox != false ) {
                map.removeLayer(map.geoBox);
            }
        });

        map.on('mousedown', function (e) {
            L.DomUtil.disableImageDrag();
            L.DomUtil.disableTextSelection();
            if (map.enableDrawing) {
                map.removeLayer(map.geoBox);
                map.dragging.disable();
                map.drawingBox = true;
                map.topLeftCord = e.latlng;
            }
        });

        map.on('mousemove', function (e) {
            if (map.enableDrawing && map.drawingBox) {
                map.removeLayer(map.geoBox);
                map.geoBox = L.rectangle([map.topLeftCord, e.latlng], {color:'#ff7800', weight:1});
                map.addLayer(map.geoBox);
            }
        });

        map.on('mouseup', function (e) {
            L.DomUtil.enableImageDrag();
            L.DomUtil.enableTextSelection();
            $('.leaflet-container').css('cursor','pointer','!important'); 
            if (map.enableDrawing && map.drawingBox) {
                map.removeLayer(map.geoBox);
                var bounds = [map.topLeftCord, e.latlng];
                map.geoBox = L.rectangle(bounds, {color:'#00FF78', weight:2});
                map.addLayer(map.geoBox);

                var top_left_lat = Math.round(map.topLeftCord.lat * 10000) / 10000;
                var top_left_lng = Math.round(map.topLeftCord.lng * 10000) / 10000;

                var bottom_right_lat = Math.round(e.latlng.lat * 10000) / 10000;
                var bottom_right_lng = Math.round(e.latlng.lng * 10000) / 10000;

                $('#partner-geofence-latlng').html('[' + top_left_lat + ', ' + top_left_lng + ', ' + bottom_right_lat + ', ' + bottom_right_lng);

               	app.geofence = {
					top_left_lat: top_left_lat,
                	top_left_lng: top_left_lng,
                	bottom_right_lat: bottom_right_lat,
                	bottom_right_lng: bottom_right_lng,
               	}

                map.drawingBox = false;
                map.enableDrawing = false;
                map.dragging.enable();

                // todo: enable the create button
            }
        });


	},

	populate_sponsors_list: function() {
		var partners = app.models['partners'].collection;
		var html = '';
		for(var i=0;i<partners.length;i++) {
			var partner = partners[i];
			html += '<option value="'+ partner.id + '"">' + partner.name + '</option>';
		}
		$('#new-ride-sponsor-list').html(html);
	},

	actions: {

		get: function(model, id, success, failure) {
			$.ajax({
				url: '/api/' + model + '/' + id,
				type: 'GET',
				success: function(resp) { success(resp); },
				error: function() { failure(resp); }
			});
		},

		get_collection: function(model, start, count, success, failure) {
			$.ajax({
				url: '/api/' + model + '?start=' + start + '&count=' + count,
				type: 'GET',
				success: function(resp) { success(resp); },
				failure: function(resp) { failure(resp); }
			});
		},

		create: function(model, thing, success, failure) {
			var data = JSON.stringify(thing);
			console.log('create(), sending: ' + data);
			$.ajax({
				url: '/api/' + model,
				type: 'POST',
				data: data,
				success: function(resp) { success(resp); },
				failure: function(resp) { failsure(resp); }
			});
		},

		update: function(model, id, thing, success, failure) {
			$.ajax({
				url: '/api/' + model + '/' + id,
				type: 'PUT',
				data: JSON.stringify(thing),
				success: function(resp) { success(resp); },
				failure: function(resp) { failsure(resp); }
			});
		},

		remove: function(model, thing, success, failure) {
			$.ajax({
				url: '/api/' + model + '/' + id,
				type: 'DELETE',
				success: function(resp) { success(resp); },
				failure: function(resp) { failsure(resp); }
			});
		},
	},

	models: {
		
		// users
    	'users': {

      		fields: [
        		'first', //: 'text',
	        	'last', //: 'text',
	        	'email', //: 'email',
	        	'password', //: 'password',
	        	'is_admin' //: 'checkbox'
	     	],

	     	start: 0,
	     	count: 50,
			collection: [],
			single: {},

			refresh: function() { 
				console.log('users.refresh()');

				$('#users-list').html('<img src="static/gears.svg"></img>');

				app.actions.get_collection(
					'users',
					app.models['users'].start,
					app.models['users'].count,
					function(resp) {
						console.log(resp);
						app.models['users'].collection = resp;
						var users = resp;
						var html = '';
						html += '<div class="button-holder">';
						if ( app.models.users.start != 0 )
							html += '<button class="left">&lt;&lt; Previous</button>';
						if ( users.length == app.models.users.count )
							html += '<button class="right">Next &gt;&gt;</button></div>';
						if ( users.length == 0 )
							html += '<p>No Users yet!</p>';
						else {
							html += '<table>';
							html += '<thead>';
							html += '<tr><td>Name</td><td>Last Login</td><td>Platform</td><td>Actions</td></tr>';
							html += '</thead>';
							html += '<tbody>';
							for(var i=0; i<users.length; i++) {
								var user = users[i];
								html += '<tr>';
								html += '<td>' + user.first + ' ' + user.last + '</td>';
								html += '<td>' + user.last_login + '</td>';
								html += '<td>' + user.platform + '</td>';
								//html += '<td>' + sponsor.name + '</td>';
								html += '<td>';
								//html += '    <a id="edit-user-' + user.id + '" class="edit-link"><i class="fa fa-pencil"></i></a>';
								//html += '    <a id="cancel-user-' + user.id + '"><i class="fa fa-trash"></i></a>';
								html += '    <a id="info-user-' + user.id + '" class="info-link"><i class="fa fa-info"></i></a>';
								html += '</td>';
								html += '</tr>';
							}
							html += '</tbody>';
							html += '</table>'
						}
						$('#users-list').html(html);
					},
					function(resp) { /* window.location = '/login'; */ }
				);
			},

    	},

    	// Partners
		'partners': {

			fields: [
				'name', //: 'text',
				'description', //: 'textarea',
				'address_0', //: 'text',
				'address_1', //: 'text',
				'city', //: 'text',
				'state', //: 'text',
				'zipcode', //: 'text',
				'partner_level', //: 'model',
				'notifiation_text', //: 'text',
				'geo_fence' //: 'geo_fence' 
			],
			start: 0,
			count: 50,
			collection: [],
			single: {},

			refresh: function() { 

				console.log('partners.refresh()');

				$('#partners-list').html('<img src="static/gears.svg"></img>');

				app.actions.get_collection(
					'partners',
					app.models['partners'].start,
					app.models['partners'].count,
					function(resp) {
						console.log(resp);
						app.models['partners'].collection = resp;
						var partners = resp;
						var html = '';
						html += '<div class="button-holder">';
						if ( app.models.partners.start != 0 )
							html += '<button class="left">&lt;&lt; Previous</button>';
						if ( partners.length == app.models.partners.count )
							html += '<button class="right">Next &gt;&gt;</button></div>';
						if ( partners.length == 0 )
							html += '<p>No Partners yet!  Click the plus above to create one!</p>';
						else {
							html += '<table>';
							html += '<thead>';
							html += '<tr><td>Name</td><td>Description</td><td>Address</td><td>Actions</td></tr>';
							html += '</thead>';
							html += '<tbody>';
							for(var i=0; i<partners.length; i++) {
								var partner = partners[i];
								html += '<tr>';
								html += '<td>' + partner.name + '</td>';
								html += '<td>' + partner.description + '</td>';
								html += '<td>' + partner.address_0 + ', ' + partner.city + ' ' + partner.zipcode + '</td>';
								//html += '<td>' + sponsor.name + '</td>';
								html += '<td>';
								html += '    <a id="edit-partner-' + partner.id + '" class="edit-link"><i class="fa fa-pencil"></i></a>';
								html += '    <a id="cancel-partner-' + partner.id + '"><i class="fa fa-trash"></i></a>';
								html += '</td>';
								html += '</tr>';
							}
							html += '</tbody>';
							html += '</table>'
						}
						$('#partners-list').html(html);
					},
					function(resp) { /* window.location = '/login'; */ }
				);
			}

		},

		'rides': {

			fields: [
				'title', //: 'text',
				'description', //: 'textarea',
				'address_0', //: 'text',
				'address_1', //: 'text',
				'city', //: 'text',
				'state', //: 'text',
				'zipcode' //: 'text'
			],

			start: 0,
			count: 50,
			collection: [],
			single: {},

			refresh: function() {

				$('#rides-list').html('<img src="static/gears.svg"></img>');

				app.actions.get_collection(
					'rides',
					app.models['rides'].start,
					app.models['rides'].count,
					function(resp) {
						console.log(resp);
						app.models['rides'].collection = resp;
						var rides = resp;
						var html = '';
						html += '<div class="button-holder">';
						if ( app.models.rides.start != 0 )
							html += '<button class="left">&lt;&lt; Previous</button>';
						if ( rides.length == app.models.rides.count )
							html += '<button class="right">Next &gt;&gt;</button></div>';
						if ( rides.length == 0 )
							html += '<p>No rides yet!  Click the plus above to create one!</p>';
						else {
							html += '<table>';
							html += '<thead>';
							html += '<tr><td>Date</td><td>Location</td><td>Sponsor</td><td>Actions</td></tr>';
							html += '</thead>';
							html += '<tbody>';
							for(var i=0; i<rides.length; i++) {
								var ride = rides[i].ride;
								var sponsor = rides[i].sponsor;
								html += '<tr>';
								html += '<td>' + ride.ride_datetime + '</td>';
								html += '<td>' + ride.address_0 + ', ' + ride.city + ' ' + ride.zipcode + '</td>';
								html += '<td>' + sponsor.name + '</td>';
								html += '<td>';
								html += '    <a id="edit-ride-' + ride.id + '" class="edit-link"><i class="fa fa-pencil"></i></a>';
								html += '    <a id="cancel-ride-' + ride.id + '"><i class="fa fa-trash"></i></a>';
								html += '</td>';
								html += '</tr>';
							}
							html += '</tbody>';
							html += '</table>'
						}
						$('#rides-list').html(html);
					},
					function(resp) { /* window.location = '/login'; */ }
				);

			},
		},

		// CheckIns

		'checkins': {

			fields: [
				'race', //: 'modal',
				'user', //: 'modal',
				'accepts_terms' //: 'boolean'
			],

			collection: [],
			single: {},

			refresh: function() {
			
			},

		}
	}
}