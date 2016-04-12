
var app = {

	init: function() {
		
		// connect all the pages
		$('#page-nav-link-rides').on('click', function() { app.display_page('rides'); } );
		$('#page-nav-link-partners').on('click', function() { app.display_page('partners'); } );
		$('#page-nav-link-users').on('click', function() { app.display_page('users'); } );
		$('#page-nav-link-settings').on('click', function() { app.display_page('settings'); } );
		$('#page-nav-link-logout').on('click', function() { app.display_page('logout'); } );

		$('#cancel-new-ride').on('click', function() { app.display_page('rides'); });
		$('#cancel-new-partner').on('click', function() { app.display_page('partners'); });

		$('#legal-notice-update-button').on('click', function() { app.models.settings.update_legal(); });

		//
		// Rides
		//

		// refresh ride list
		app.models['rides'].refresh();

		// connect creating a new ride modal
		$('#open-new-ride-modal').on('click', function() {
			/*
			app.populate_sponsors_list();
			$('#modal-new-ride').reveal({
    			animation: 'fadeAndPop',
    			animationspeed: 250,
    			closeonbackgroundclick: true,
    			dismissmodalclass: 'modal-new-ride-cancel'
    		});
    		*/
    		app.display_page('new-ride');
		})

		// connect date picker
		$('#new-ride-ride_datetime').datepicker();

		// connect create new ride button in modal
		$('#create-new-ride').on('click', function() {
			
			var title = $('#new-ride-title').val();
			var description = $('#new-ride-description').val();
			var ride_datetime = $('#new-ride-ride_datetime').val();
			var address_0 = $('#new-ride-address_0').val();
			var city = $('#new-ride-city').val();
			var state = $('#new-ride-state').val();
			var zipcode = $('#new-ride-zipcode').val();
			var sponsor_id = $('#new-ride-sponsor_id').val();

			var data = {
				'title': title,
				'description': description,
				'ride_datetime': ride_datetime,
				'address_0': address_0,
				//'address_1': '',
				'city': city,
				'state': state,
				'zipcode': zipcode,
				'sponsor_id': sponsor_id 
			};

			var bad_input = false;
			for( var key in data ) {
				if ( data[key] == '' ) {
					console.log('bad input: ' + key)
					$('#new-ride-' + key).addClass('bad-input');
					bad_input = true;
				}
			}

			// make sure our inputs are valid
			if ( bad_input ) {
				$("html, body").animate({ scrollTop: 0 });
				//alert('Please check your inputs, and try again.');
				$('#new-ride-bad-iputs').show();
			}
			else {

				// hack
				data['address_1'] = '';

				app.actions.create(
					'rides',
					data,
					function(resp) {
						//$('#modal-new-ride').trigger('reveal:close');
						app.models['rides'].refresh(function() {
							app.display_page('rides');	
						});
					},
					function(resp) { 
						console.log('create_new_ride: error');
						console.log(resp);
						if ( resp.status == 400 ) {
							// missing information
						}

						//window.location = '/login';
					}
				);

			}
		});

		//
		// Partners
		//

		// refresh the partner list
		app.models['partners'].refresh();

		// connect creating a new partner modal
		$('#open-new-partner-modal').on('click', function() {
			/*
			$('#modal-new-partner').reveal({
    			animation: 'fadeAndPop',
    			animationspeed: 250,
    			closeonbackgroundclick: true,
    			dismissmodalclass: 'modal-new-partner-cancel'
    		});
    		*/
    		app.display_page('new-partner');

    		// init the map for partner geo fence
			app.init_geofence_map();
		})

		// connect date picker
		//$('#new-partner-ride_datetime').datepicker();

		// connect create new partner button in modal
		$('#create-new-partner').on('click', function() {
			
			var name = $('#new-partner-name').val();
			var description = $('#new-partner-description').val();
			var notification_text = $('#new-partner-notification_text').val();
			var address_0 = $('#new-partner-address_0').val();
			var city = $('#new-partner-city').val();
			var state = $('#new-partner-state').val();
			var zipcode = $('#new-partner-zipcode').val();
			var fence_top_left_lat = '';
			var fence_top_left_lng = '';
			var fence_bottom_right_lat = '';
			var fence_bottom_right_lng = '';

			if ( app.geofence != undefined ) {
				fence_top_left_lat = app.geofence.top_left_lat;
				fence_top_left_lng = app.geofence.top_left_lng;
				fence_bottom_right_lat = app.geofence.bottom_right_lat;
				fence_bottom_right_lng = app.geofence.bottom_right_lng;
			}

			var data = {
				'name': name,
				'description': description,
				'notification_text': notification_text,
				'address_0': address_0,
				//'address_1': '',
				'city': city,
				'state': state,
				'zipcode': zipcode,
				'fence_top_left_lat': fence_top_left_lat,
				'fence_top_left_lng': fence_top_left_lng,
				'fence_bottom_right_lat': fence_bottom_right_lat,
				'fence_bottom_right_lng': fence_bottom_right_lng
			};

			var bad_input = false;
			for( var key in data ) {
				if ( data[key] == '' ) {
					console.log('bad input: ' + key)
					$('#new-partner-' + key).addClass('bad-input');
					bad_input = true;
				}
			}

			if ( fence_top_left_lat == '' || fence_top_left_lng == '' || 
				 fence_bottom_right_lat == '' || fence_bottom_right_lat == '' )
			{
				$('#new-partner-bad-geofence').show();
				bad_input = true;
			}

			// make sure our inputs are valid
			if ( bad_input ) {
				$("html, body").animate({ scrollTop: 0 });
				//alert('Please check your inputs, and try again.');
				$('#new-partner-bad-inputs').show();
			}
			else {

				// hack ...
				data['address_1'] = '';				

				app.actions.create(
					'partners',
					data,
					function() {
						//$('#modal-new-partner').trigger('reveal:close');
						app.models['partners'].refresh(function() {
							app.display_page('partners');
						});
					},
					function(resp) { 
						console.log('create_new_ride: error');
						console.log(resp);
						if ( resp.status == 400 ) {
							// missing information
						}

						//window.location = '/login';
					}
				);

			}
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
			case 'new-ride':
				$('#page-new-ride').show();
				app.populate_sponsors_list();
				break;
			case 'partners':
				$('#page-partners').show();
				app.models['partners'].refresh();
				break;
			case 'new-partner':
				$('#page-new-partner').show();
				//app.populate_sponsors_list();
				//app.models['rides'].refresh();
				break;
			case 'users':
				$('#page-users').show();
				app.models['users'].refresh();
				break;
			case 'settings':
				$('#page-settings').show();
				app.models['settings'].refresh_legal();
				break;
			case 'logout':
				app.logout(
					function() { window.location = '/login' },
				 	function() { window.location = '/login' }
				);
				break;
			default:
				//window.location = '/login';
				break;
		};
		
	},

	map: null,
	mainTileLayer: null,
	geo_fence: {},

	init_geofence_map: function() {

		console.log('app.init_geofence_map()');

		if ( app.map == null ) {
 
			console.log('app.init_geofence_map(), setting up map ...');

			// initialize map
	        app.mainTileLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	             attribution: 'Map data © OpenStreetMap contributors',
	             minZoom: 4,
	             maxZoom: 16
	        }),

	        app.map = L.map('partner-geofence-map', {
	            center: [42.91, -78.85],
	            zoom: 11,
	            layers: [
	                app.mainTileLayer
	            ]
	        });

	        app.map.drawingBox = false;
	        app.map.geoBox = false;

	        $('#partner-geo-fence-button').on('click', function (e) {
	            app.map.enableDrawing = true;
	            $('.leaflet-container').css('cursor','crosshair','!important');
	            if ( app.map.geoBox != false ) {
	                map.removeLayer(app.map.geoBox);
	            }
	        });

	        app.map.on('mousedown', function (e) {
	            L.DomUtil.disableImageDrag();
	            L.DomUtil.disableTextSelection();
	            if (app.map.enableDrawing) {
	                app.map.removeLayer(app.map.geoBox);
	                app.map.dragging.disable();
	                app.map.drawingBox = true;
	                app.map.topLeftCord = e.latlng;
	            }
	        });

	        app.map.on('mousemove', function (e) {
	            if (app.map.enableDrawing && app.map.drawingBox) {
	                app.map.removeLayer(app.map.geoBox);
	                app.map.geoBox = L.rectangle([app.map.topLeftCord, e.latlng], {color:'#ff7800', weight:1});
	                app.map.addLayer(app.map.geoBox);
	            }
	        });

	        app.map.on('mouseup', function (e) {
	            L.DomUtil.enableImageDrag();
	            L.DomUtil.enableTextSelection();
	            $('.leaflet-container').css('cursor','pointer','!important'); 
	            if (app.map.enableDrawing && app.map.drawingBox) {
	                app.map.removeLayer(app.map.geoBox);
	                var bounds = [app.map.topLeftCord, e.latlng];
	                app.map.geoBox = L.rectangle(bounds, {color:'#00FF78', weight:2});
	                app.map.addLayer(app.map.geoBox);

	                var top_left_lat = Math.round(app.map.topLeftCord.lat * 10000) / 10000;
	                var top_left_lng = Math.round(app.map.topLeftCord.lng * 10000) / 10000;

	                var bottom_right_lat = Math.round(e.latlng.lat * 10000) / 10000;
	                var bottom_right_lng = Math.round(e.latlng.lng * 10000) / 10000;

	                $('#partner-geofence-latlng').html('[' + top_left_lat + ', ' + top_left_lng + ', ' + bottom_right_lat + ', ' + bottom_right_lng);

	               	app.geofence = {
						top_left_lat: top_left_lat,
	                	top_left_lng: top_left_lng,
	                	bottom_right_lat: bottom_right_lat,
	                	bottom_right_lng: bottom_right_lng,
	               	}

	                app.map.drawingBox = false;
	                app.map.enableDrawing = false;
	                app.map.dragging.enable();

	                // todo: enable the create button
	            }
	        });

    	}

	},

	populate_sponsors_list: function() {
		var partners = app.models['partners'].collection;
		var html = '';
		for(var i=0;i<partners.length;i++) {
			var partner = partners[i];
			html += '<option value="'+ partner.id + '"">' + partner.name + '</option>';
		}
		$('#new-ride-sponsor_id').html(html);
	},

	actions: {

		get: function(model, id, success, failure) {
			$.ajax({
				url: '/api/' + model + '/' + id,
				type: 'GET',
				success: function(resp) { success(resp); },
				error: function() { if ( failure != undefined ) { failure(resp); } }
			});
		},

		get_collection: function(model, start, count, success, failure) {
			$.ajax({
				url: '/api/' + model + '?start=' + start + '&count=' + count,
				type: 'GET',
				success: function(resp) { success(resp); },
				error: function(resp) { if ( failure != undefined ) { failure(resp); } }
			});
		},

		create: function(model, thing, success, failure) {
			var data = JSON.stringify(thing);
			//console.log('create(), sending: ' + data);
			$.ajax({
				url: '/api/' + model,
				type: 'POST',
				data: data,
				success: function(resp) { success(resp); },
				error: function(resp) { if ( failure != undefined ) { failure(resp); } }
			});
		},

		update: function(model, id, thing, success, failure) {
			$.ajax({
				url: '/api/' + model + '/' + id,
				type: 'PUT',
				data: JSON.stringify(thing),
				success: function(resp) { success(resp); },
				error: function(resp) { if ( failure != undefined ) { failure(resp); } }
			});
		},

		remove: function(model, thing, success, failure) {
			$.ajax({
				url: '/api/' + model + '/' + id,
				type: 'DELETE',
				success: function(resp) { success(resp); },
				error: function(resp) { failure(resp); }
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
	     	count: 5000,
			collection: [],
			single: {},

			user_from_id: function(id) {

				for(var index in app.models.users.collection) {
					var user = app.models.users.collection[index];
					console.log(user);
					if (user.id == id) {
						return user;
					}
				}
				return null;

			},

			show_user_settings: function(id) {

				var user = app.models.users.user_from_id(id);

				app.models.users.single = user;

				console.log('user:', user);

				if ( user == null ) {
					app.logout();
				}

				var html = '';

				html += '<h4>' + user.first + ' ' + user.last + '</h4>';

				html += '<label>First</label>';
				html += '<input type="text" readonly value="' + user.first + '"></input>';

				html += '<label>Last</label>';
				html += '<input type="text" readonly value="' + user.last + '"></input>';

				html += '<label>Email</label>';
				html += '<input type="text" readonly value="' + user.email + '"></input>';

				html += '<label>Last Login</label>';
				html += '<input type="text" readonly value="' + user.last_login.split('.')[0] + '"></input>';

				
				if ( user.is_admin ) {
					html +=' <input id="user-is-admin-checkbox" type="checkbox" value="" checked></input>';
				} else {
					html += '<input id="user-is-admin-checkbox" type="checkbox" value=""></input>';
				}
				html += '<label for="user-is-admin-checkbox">User is Administrator</label>';
				html += '<i>note: only users with admin privileges can login to the admin interface</i>';

				$('#user-settings-content').html(html);

				$('#update-user-settings-button').off('click');
				$('#update-user-settings-button').on('click', function() {
					var user = app.models.users.single;
					var is_admin = $('#user-is-admin-checkbox').is(':checked');
					if ( user.is_admin != is_admin ) {
						user.is_admin = is_admin;
						console.log('updating user:')
						console.log(user);
						app.actions.update(
							'users',
							user.id,
							user,
							function(resp) {
								$('#user-settings-modal').trigger('reveal:close');
							}
						);
					}
					else {
						$('#user-settings-modal').trigger('reveal:close');
					}
				});

				$('#user-settings-modal').reveal({
					animation: 'fadeAndPop',
					animationspeed: 300,
					loseonbackgroundclick: true,
					dismissmodalclass: 'update-user-settings-close'
				});

			},

			refresh: function(callback) { 
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
								html += '    <a id="' + user.id + '" class="user-settings-link"><i class="fa fa-gears"></i></a>';
								html += '</td>';
								html += '</tr>';
							}
							html += '</tbody>';
							html += '</table>'
						}
						$('#users-list').html(html);

						$('.user-settings-link').off('click');
						$('.user-settings-link').on('click', function() {
							console.log('.user-settings-link, click().')
							var id = this.id;
							app.models.users.show_user_settings(id);
						})

						if ( callback != undefined )
							callback();

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

			refresh: function(callback) { 

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

						if ( callback != undefined )
							callback();

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

			refresh: function(callback) {

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

						if ( callback != undefined )
							callback();
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

		},

		// settings

		'settings': {

			refresh_legal: function() {
				$.ajax({
					url: '/api/users/legal',
					type: 'GET',
					success: function(resp) { 
						console.log('app.models.settings.refresh_legal.success(), value = ' + resp.legal_notice); 
						$('#legal-notice').html(resp.legal_notice);
						tinymce.init({
  							selector: 'textarea#legal-notice',
  							menubar: false,
  							//inline: true,
  						});

					},
					error: function(resp) {
						console.log('app.models.settings.refresh_legal.error()'); 
						console.log(resp);
					}
				});	

			},

			update_legal: function() {
				var value = tinyMCE.get('legal-notice').getContent();
				console.log('New Legal Notice Value:' + value);
				$.ajax({
					url: '/api/users/legal',
					type: 'PUT',
					data: JSON.stringify({
						value: value,
					}),
					success: function(resp) { 
						console.log('app.models.settings.update_legal.success()'); 
						alert('Legal Notice Updated Successfull.');
						/*
						var value = resp.value
						$('#legal-notice').html(value);
						tinymce.init({
  							selector: 'textarea#legal-notice',
  							menubar: false,
  						});
  						*/  
					},
					error: function(resp) {
						console.log('app.models.settings.update_legal.error()'); 
						console.log(resp);
					}
				});	
			}

		}
	}
}