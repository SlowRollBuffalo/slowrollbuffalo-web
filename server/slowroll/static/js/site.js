
// taken from:
//   http://stackoverflow.com/a/3067896
Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
	var dd  = this.getDate().toString();
	return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};

var app = {

	init: function() {
		
		// connect all the pages
		$('#page-nav-link-rides').on('click', function() { app.display_page('rides'); } );
		$('#page-nav-link-partners').on('click', function() { app.display_page('partners'); } );
		$('#page-nav-link-users').on('click', function() { app.display_page('users'); } );
		$('#page-nav-link-settings').on('click', function() { app.display_page('settings'); } );
		$('#page-nav-link-logout').on('click', function() { app.display_page('logout'); } );

		$('#cancel-new_edit-ride').on('click', function() { app.display_page('rides'); });
		$('#cancel-new_edit-partner').on('click', function() { app.display_page('partners'); });

		$('#legal-notice-update-button').on('click', function() { app.models.settings.update_legal(); });

		//
		// Rides
		//

		// refresh ride list
		app.models['rides'].refresh();

		// connect creating a new ride modal
		$('#open-new_edit-ride-page').on('click', function() {
			/*
			app.populate_sponsors_list();
			$('#modal-new_edit-ride').reveal({
    			animation: 'fadeAndPop',
    			animationspeed: 250,
    			closeonbackgroundclick: true,
    			dismissmodalclass: 'modal-new_edit-ride-cancel'
    		});
    		*/
    		app.display_page('new_edit-ride');
		})

		// connect date picker
		$('#new_edit-ride-ride_datetime-date').datepicker();

		// connect time picker
		$('#new_edit-ride-ride_datetime-time').wickedpicker();		

		// connect create new ride button in modal
		$('#create-new_edit-ride').on('click', function() {
			
			var title = $('#new_edit-ride-title').val();
			var description = $('#new_edit-ride-description').val();
			
			var ride_datetime_date = $('#new_edit-ride-ride_datetime-date').val();
			var ride_datetime_time = $('#new_edit-ride-ride_datetime-time').val();

			var leading_zero = ((ride_datetime_time.split(':')[0].length == 1) ? '0' : '');
			var ride_datetime = ride_datetime_date + ' ' + leading_zero + ride_datetime_time.replace(/ : /g,':');

			var address_0 = $('#new_edit-ride-address_0').val();
			var city = $('#new_edit-ride-city').val();
			var state = $('#new_edit-ride-state').val();
			var zipcode = $('#new_edit-ride-zipcode').val();
			var sponsor_id = $('#new_edit-ride-sponsor_id').val();

			var data = {
				'title': title,
				'description': description,
				'ride_datetime': ride_datetime,
				'address_0': address_0,
				//'address_1': '',
				'city': city,
				'state': state,
				'zipcode': zipcode,
				'sponsor_id': sponsor_id,
				'deleted': false
			};

			var bad_input = false;
			for( var key in data ) {
				if ( key != 'deleted' && data[key] == '' ) {
					console.log('bad input: ' + key)
					$('#new_edit-ride-' + key).addClass('bad-input');
					bad_input = true;
				}
			}

			// make sure our inputs are valid
			if ( bad_input ) {
				$("html, body").animate({ scrollTop: 0 });
				//alert('Please check your inputs, and try again.');
				$('#new_edit-ride-bad-iputs').show();
			}
			else {

				// hack
				data['address_1'] = '';

				if ( app.models.rides.edit_mode == false ) {

					app.actions.create(
						'rides',
						data,
						function(resp) {
							//$('#modal-new_edit-ride').trigger('reveal:close');
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

				} else {

					app.actions.update(
						'rides',
						app.models.rides.single.ride.id,
						data,
						function(resp) {
							//$('#modal-new_edit-ride').trigger('reveal:close');
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

			}
		});

		//
		// Partners
		//

		// refresh the partner list
		app.models['partners'].refresh();

		// connect creating a new partner modal
		$('#open-new_edit-partner-page').on('click', function() {
			/*
			$('#modal-new_edit-partner').reveal({
    			animation: 'fadeAndPop',
    			animationspeed: 250,
    			closeonbackgroundclick: true,
    			dismissmodalclass: 'modal-new_edit-partner-cancel'
    		});
    		*/
    		app.display_page('new_edit-partner');

    		// init the map for partner geo fence
			app.init_geofence_map();
		})

		// connect date picker
		//$('#new_edit-partner-ride_datetime').datepicker();

		// connect create new partner button in modal
		$('#create-new_edit-partner').on('click', function() {
			
			var name = $('#new_edit-partner-name').val();
			var description = $('#new_edit-partner-description').val();
			var notification_text = $('#new_edit-partner-notification_text').val();
			var address_0 = $('#new_edit-partner-address_0').val();
			var city = $('#new_edit-partner-city').val();
			var state = $('#new_edit-partner-state').val();
			var zipcode = $('#new_edit-partner-zipcode').val();
			var fence_top_left_lat = null;
			var fence_top_left_lng = null;
			var fence_bottom_right_lat = null;
			var fence_bottom_right_lng = null;

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
				//'fence_top_left_lat': fence_top_left_lat,
				//'fence_top_left_lng': fence_top_left_lng,
				//'fence_bottom_right_lat': fence_bottom_right_lat,
				//'fence_bottom_right_lng': fence_bottom_right_lng
			};

			if ( fence_bottom_right_lat == null ) {
				alert('Be advised that with no gen fence defined for this partner, users will not get any notifications on their phone.  Edit this partner at any time to define a geo fence.');
			}

			var bad_input = false;
			for( var key in data ) {
				if ( data[key] == '' ) {
					console.log('bad input: ' + key)
					$('#new_edit-partner-' + key).addClass('bad-input');
					bad_input = true;
				}
			}

			if ( fence_top_left_lat == 0 || fence_top_left_lng == 0 || 
				 fence_bottom_right_lat == 0 || fence_bottom_right_lat == 0 )
			{
				$('#new_edit-partner-bad-geofence').show();
				bad_input = true;
			}

			// make sure our inputs are valid
			if ( bad_input ) {
				$("html, body").animate({ scrollTop: 0 });
				//alert('Please check your inputs, and try again.');
				$('#new_edit-partner-bad-inputs').show();
			}
			else {

				// hack ...
				data['address_1'] = '';				

				if ( app.models.partners.edit_mode == false ) {

					app.actions.create(
						'partners',
						data,
						function() {
							//$('#modal-new_edit-partner').trigger('reveal:close');
							app.models['partners'].refresh(function() {
								app.display_page('partners');
							});
						},
						function(resp) { 
							console.log('create new partner: error');
							console.log(resp);
							if ( resp.status == 400 ) {
								// missing information
							}

							//window.location = '/login';
						}
					);

				} else {

					app.actions.update(
						'partners',
						app.models.partners.single.id,
						data,
						function() {
							//$('#modal-new_edit-partner').trigger('reveal:close');
							app.models['partners'].refresh(function() {
								app.display_page('partners');
							});
						},
						function(resp) { 
							console.log('update partner error:');
							console.log(resp);
							if ( resp.status == 400 ) {
								// missing information
							}

							//window.location = '/login';
						}
					);

				}
				

			}
		});

		$('#cancel-ride').on('click', function() {
			var ride = self.app.models.rides.single.ride;
			//remove: function(model, thing, success, failure) {
			app.actions.remove(
				'rides',
				ride.id,
				function(resp) {
					alert('The ride has been cancelled Successfully.');
					$('#modal-ride-delete').trigger('reveal:close');
					app.display_page('rides');
				},
				function() {
					// herm ...
				}
			);
		});

		$('#delete-partner').on('click', function() {
			var partner = self.app.models.partners.signal;
			app.actions.remove(
				'partners',
				partner.id,
				function(resp) {
					alert('The partner has been deleted Successfully.');
					$('#modal-partner-delete').trigger('reveal:close');
					app.display_page('partners');
				},
				function() {
					// herm ...
				}
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
                platform: 'web',
                version: '1.0.0.',
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

    check_login: function() {
    	$.ajax({
    		url: '/api/users/login',
    		type: 'GET',
    		success: function(resp) {
    			if ( resp.loggedin == false ) {
    				window.location = '/login';
    			}
    		},
    		error: function(resp) {
    			window.location = '/login';
    		}
    	});
    },

	display_page: function(page) {
		console.log('showing page: "' + page + '"');

		app.check_login();

		app.models.rides.edit_mode = false;
		app.models.partners.edit_mode = false;

		$('#new_edit-ride-title').val('');
		$('#new_edit-ride-description').val('');
		$('#new_edit-ride-ride_datetime').val('');
		$('#new_edit-ride-address_0').val('');
		$('#new_edit-ride-city').val('');
		$('#new_edit-ride-state').val('');
		$('#new_edit-ride-zipcode').val('');
		$('#new_edit-ride-sponsor_id').val('');

		$('#new_edit-partner-name').val('');
		$('#new_edit-partner-description').val('');
		$('#new_edit-partner-notification_text').val('');
		$('#new_edit-partner-address_0').val('');
		$('#new_edit-partner-city').val('');
		$('#new_edit-partner-state').val('');
		$('#new_edit-partner-zipcode').val('');
					
		$('.page').hide()
		switch(page) {
			case 'rides':
				$('#page-rides').show();
				app.models['rides'].refresh();
				break;
			case 'new_edit-ride':
				if ( !app.models.rides.edit_mode )
					$('#new_edit-ride-ride_datetime-time').val('06:30 PM');
				$('#create-new_edit-partner').html('Create Ride!');
				$('#new_edit-ride-city').val('Buffalo');
				$('#new_edit-ride-state').val('NY');
				$('#page-new_edit-ride').show();
				app.populate_sponsors_list();
				break;
			case 'partners':
				$('#page-partners').show();
				app.models['partners'].refresh();
				break;
			case 'new_edit-partner':
				$('#create-new_edit-partner').html('Create Partner!');
				$('#page-new_edit-partner').show();
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
	
		$('#gears-place-holder').hide();

	},

	map: null,
	mainTileLayer: null,
	geo_fence: {},

	update_geofence: function() {

		

	},

	init_geofence_map: function(callback) {

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
	                app.map.removeLayer(app.map.geoBox);
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

			       	app.geofence = {
						top_left_lat: top_left_lat,
			        	top_left_lng: top_left_lng,
			        	bottom_right_lat: bottom_right_lat,
			        	bottom_right_lng: bottom_right_lng,
			       	}

			       	console.log('geofence: ', app.geofence);

	                $('#partner-geofence-latlng').html('[ ' + app.geofence.top_left_lat + ', ' + app.geofence.top_left_lng + ', ' + app.geofence.bottom_right_lat + ', ' + app.geofence.bottom_right_lng + ' ]');

	                app.map.drawingBox = false;
	                app.map.enableDrawing = false;
	                app.map.dragging.enable();

	                // todo: enable the create button
	            }
	        });

	        console.log('init_geofence_map(), map setup complete.');

    	}

    	console.log('init_geofence_map(), callback: ', callback);
    	if ( callback != undefined ) {
    		console.log('init_geofence_map(), calling callback ...');
    		callback();
    	}

	},

	populate_sponsors_list: function(callback) {
		var partners = app.models['partners'].collection;
		var html = '';
		html += '<option value="null"> - None - </option>';
		for(var i=0;i<partners.length;i++) {
			var partner = partners[i];
			html += '<option value="'+ partner.id + '"">' + partner.name + '</option>';
		}
		$('#new_edit-ride-sponsor_id').html(html);

		if ( callback != undefined ) {
			callback();
		}
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
			console.log('[PUT]', model, id, thing);
			$.ajax({
				url: '/api/' + model + '/' + id,
				type: 'PUT',
				data: JSON.stringify(thing),
				success: function(resp) { success(resp); },
				error: function(resp) { if ( failure != undefined ) { failure(resp); } }
			});
		},

		remove: function(model, id, success, failure) {
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
				html += '<br/><i>note: only users with admin privileges can login to the admin interface</i>';

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
								html += '<td>' + user.last_login.split('.')[0] + '</td>';
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

			edit_mode: false,

			partner_from_id: function(id) {
				for ( var index in app.models.partners.collection ) {
					var partner = app.models.partners.collection[index];
					console.log(partner);
					if (partner.id == id) {
						return partner;
					}
				}
				return null;
			},

			populate_edit_page: function() {

				//app.models.partners.edit_mode = true;
				$('#create-new_edit-partner').html('Update Partner');

				var partner = app.models.partners.single;

				$('#new_edit-partner-name').val(partner.name);
				$('#new_edit-partner-description').val(partner.description);
				$('#new_edit-partner-notification_text').val(partner.notification_text);
				$('#new_edit-partner-address_0').val(partner.address_0);
				$('#new_edit-partner-city').val(partner.city);
				$('#new_edit-partner-state').val(partner.state);
				$('#new_edit-partner-zipcode').val(partner.zipcode);

			},

			populate_geofence: function() {

				console.log('populate_geofence(), drawing fence ...');

				var partner = app.models.partners.single;

				app.geofence = {
					top_left_lat: partner.fence_top_left_lat,
					top_left_lng: partner.fence_top_left_lng,
					bottom_right_lat: partner.fence_bottom_right_lat,
					bottom_right_lng: partner.fence_bottom_right_lng,
				};
				app.map.removeLayer(app.map.geoBox);
		        //var bounds = [app.map.topLeftCord, e.latlng];
		        var bounds = [
		        	{
		        		lat: app.geofence.top_left_lat,
		        		lng: app.geofence.top_left_lng,
		        	},
		        	{
		        		lat: app.geofence.bottom_right_lat,
		        		lng: app.geofence.bottom_right_lng,
		        	}
		        ];
		        app.map.enableDrawing = true;
		        app.map.geoBox = L.rectangle(bounds, {color:'#00FF78', weight:2});
		        app.map.addLayer(app.map.geoBox);
		        app.map.enableDrawing = false;

		        console.log('populate_geofence(), done drawing map.');
			},

			refresh: function(callback) { 

				console.log('partners.refresh()');

				$('#partners-list').html('<img src="static/gears.svg"></img>');

				app.actions.get_collection(
					'partners',
					app.models['partners'].start,
					app.models['partners'].count,
					function(resp) {
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
								html += '    <a id="' + partner.id + '" class="edit-parter-link edit-link"><i class="fa fa-pencil"></i></a>';
								html += '    <a id="' + partner.id + '" class="delete-partner-link"><i class="fa fa-trash"></i></a>';
								html += '</td>';
								html += '</tr>';
							}
							html += '</tbody>';
							html += '</table>'
						}
						$('#partners-list').html(html);

						$('.edit-parter-link').off('click');
						$('.edit-parter-link').on('click', function() {
							console.log('.edit-parter-link, click().')							
							var id = this.id;
							app.models.partners.single = app.models.partners.partner_from_id(id);

							app.display_page('new_edit-partner');

							app.models.partners.populate_edit_page();

							app.init_geofence_map( function() {
								app.models.partners.populate_geofence();
							});

							app.models.partners.edit_mode = true;

						});

						$('.delete-partner-link').off('click');
						$('.delete-partner-link').on('click', function() {
							console.log('.delete-parnter-link, click().')							
							var id = this.id;

							app.models.partners.single = app.models.partners.partner_from_id(id);
							
							var partner = app.models.partners.partner_from_id(id);

							var html = '';

							html += '<h4>Are you sure you want to delete this partner?</span></h4>';
					     	html += '<span>Name: <b>' + partner.name + '</b></span><br/>';
					     	html += '<span>Street: <b>' + partner.address_0 + '</b></span><br/>';

					     	$('#modal-partner-delete-details').html(html);

					     	$('#modal-partner-delete').reveal({
								animation: 'fadeAndPop',
								animationspeed: 300,
								loseonbackgroundclick: true,
								dismissmodalclass: 'modal-partner-delete-cancel'
							});

					    });

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

			edit_mode: false,

			ride_from_id: function(id) {
				console.log('ride_from_id(), id: ' + id + ', rides:', app.models.rides.collection);
				for ( var index in app.models.rides.collection ) {
					var _ride = app.models.rides.collection[index];
					//console.log(ride);
					if (_ride.ride.id == id) {
						return _ride;
					}
				}
				return null;
			},

			populate_edit_page: function() {

				console.log('app.models.rides.populate_edit_page()');

				//app.models.partners.edit_mode = true;
				$('#create-new_edit-ride').html('Update Ride');

				var ride = app.models.rides.single.ride;
				var sponsor = app.models.rides.single.sponsor;
				var checkin_count = app.models.rides.single.checkin_count;

				console.log('ride: ', ride);
				console.log('sponsor: ', sponsor);
				console.log('checkin_count: ', checkin_count);

				var date = ride.ride_datetime.split(' ')[0]; // YYYY-MM-DD
				var ride_date = date.split('-')[1] + '/' + date.split('-')[2] + '/' + date.split('-')[0]; // MM-DD-YYYY
				var hours = ride.ride_datetime.split(' ')[1].split('.')[0].split(':')[0];
				var minutes = ride.ride_datetime.split(' ')[1].split('.')[0].split(':')[0];
				var ride_time = '' + ((hours <= 12) ? hours : hours-12) + ':' + minutes + ' ' + ((hours <= 12) ? 'AM' : 'PM');

				console.log('ride: ', ride);

				$('#new_edit-ride-title').val(ride.title);
				$('#new_edit-ride-description').val(ride.description);
				$('#new_edit-ride-ride_datetime-date').val(ride_date);
				$('#new_edit-ride-ride_datetime-time').val(ride_time);
				$('#new_edit-ride-address_0').val(ride.address_0);
				$('#new_edit-ride-city').val(ride.city);
				$('#new_edit-ride-state').val(ride.state);
				$('#new_edit-ride-zipcode').val(ride.zipcode);

				app.populate_sponsors_list(function() {
					if ( sponsor != null && sponsor !== undefined ) {
						console.log('app.models.rides.populate_edit_page(), populating sponsor list selection with id: ' + sponsor.id);
						$('#new_edit-ride-sponsor_id').val(sponsor.id);
					} else {
						$('#new_edit-ride-sponsor_id').val(null);
					}
				});

			},

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
							html += '<tr><td>Date</td><td>Location</td><td>Sponsor</td><td>Check Ins</td><td>Actions</td></tr>';
							html += '</thead>';
							html += '<tbody>';
							for(var i=0; i<rides.length; i++) {
								var ride = rides[i].ride;
								var sponsor = rides[i].sponsor;
								var checkin_count = rides[i].checkin_count;
								var now = new Date();
								if ( ride.ride_datetime.split(' ')[0] == now.yyyymmdd() ) {
									html += '<tr class="ride-today-row">'
								} else {
									html += '<tr>';
								}
								html += '<td>' + ride.ride_datetime + '</td>';
								html += '<td>' + ride.address_0 + ', ' + ride.city + ' ' + ride.zipcode + '</td>';
								if ( sponsor != null && sponsor !== undefined )
									html += '<td>' + sponsor.name + '</td>';
								else
									html += '<td> - None - </td>';
								html += '<td>' + checkin_count + ' <a id="' + ride.id + '" class="ride-checkin-report-button"><i class="fa fa-question"></i></a></td>';
								html += '<td>';
								html += '    <a id="' + ride.id + '" class="edit-link edit-ride-link"><i class="fa fa-pencil"></i></a>';
								html += '    <a id="' + ride.id + '" class="delete-ride-link"><i class="fa fa-trash"></i></a>';
								html += '</td>';
								html += '</tr>';
							}
							html += '</tbody>';
							html += '</table>'
						}
						$('#rides-list').html(html);

						$('.ride-checkin-report-button').off('click');
						$('.ride-checkin-report-button').on('click', function() {
							var ride = app.models.rides.ride_from_id(this.id);
							
							console.log('ride:', ride);

							app.models.checkins.refresh(ride);
							
							$('#modal-ride-checkins').reveal({
				    			animation: 'fadeAndPop',
				    			animationspeed: 250,
				    			closeonbackgroundclick: true,
				    			dismissmodalclass: 'modal-ride-checkins-cancel'
				    		});

						});

						$('.edit-ride-link').off('click');
						$('.edit-ride-link').on('click', function() {
							console.log('.edit-ride-link, click().')							
							var id = this.id;
							app.models.rides.single = app.models.rides.ride_from_id(id);

							app.display_page('new_edit-ride');

							app.models.rides.populate_edit_page();

							app.models.rides.edit_mode = true;

						});

						$('.delete-ride-link').off('click');
						$('.delete-ride-link').on('click', function() {

							console.log('.delete-ride-link, click().')							
							var id = this.id;

							app.models.rides.single = app.models.rides.ride_from_id(id);
							
							var ride = app.models.rides.ride_from_id(id).ride;

							var html = '';

							html += '<h4>Are you sure you want to cancel this ride?</span></h4>';
					     	html += '<span>Ride: <b>' + ride.title + '</b></span><br/>';
					     	html += '<span>Date: <b>' + ride.ride_datetime + '</b></span><br/>';

					     	$('#modal-ride-delete-details').html(html);

					     	$('#modal-ride-delete').reveal({
								animation: 'fadeAndPop',
								animationspeed: 300,
								loseonbackgroundclick: true,
								dismissmodalclass: 'modal-ride-delete-cancel'
							});

					    });

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

			refresh: function(_ride) {
				var ride = _ride.ride;
				var sponsor = _ride.sponsor;
				var checkin_count = _ride.checkin_count;
				$.ajax({
					url: '/api/checkins?ride_id=' + ride.id,
					type: 'GET',
					success: function(resp) {

						console.log('/api/checkins response: ', resp);

						app.models.checkins.collection = resp;
						var checkins = resp;

						var html = '';

						html += '<a target="_blank" href="/checkins?ride_id=' + ride.id + '">Pritable Version</a></br>';

						html += '<br/><i>There are <b>' + checkins.length + '</b> people checked into this ride.</i><br/><br/>';

						if ( checkins.length == 0 ) {

							// nothing to do

						} else {

							html += '<div id="ride-checkins-list-table"><table>';
							html += '<thead>';
							html += '<tr><th>Last</th><th>First</th><th>Email</th></tr>';
							html += '</thead>'
							html += '<tbody>';
							for(var i=0; i<checkins.length; i++) {
								var checkin = checkins[i].checkin;
								var user = checkins[i].user;
								html += '<tr>';
								html += '<td>' + user.last + '</td><td>' + user.first + '</td><td>' + user.email + '</td>';
								html += '</tr>';
							}
							html += '</tbody>';
							html += '</table></div>';

							console.log('Checkin HTML: \n' + html);

						}

						$('#ride-checkins-list').html(html);
					},
					error: function(resp) {
						//window.location = '/login';
					}
				});

				
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