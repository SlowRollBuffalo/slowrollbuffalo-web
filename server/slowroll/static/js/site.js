
var sr = {

	init: function() {
		
		// connect all the pages
		$('#page-nav-link-rides').on('click', function() { sr.display_page('rides'); } );
		$('#page-nav-link-partners').on('click', function() { sr.display_page('partners'); } );
		$('#page-nav-link-users').on('click', function() { sr.display_page('users'); } );
		$('#page-nav-link-settings').on('click', function() { sr.display_page('settings'); } );
		$('#page-nav-link-logout').on('click', function() { sr.display_page('logout'); } );

		// connect creating a new ride modal
		$('#open-new-ride-modal').on('click', function() {
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
				'zipcode': $('#new-ride-zipcode').val()
			};
			sr.actions.create(
				'rides',
				data,
				function() {
					$('#modal-new-ride').trigger('reveal:close');
				},
				function() { window.location = '/login'; }
			);
		});
		console.log('sr.init() complete.');
	},

	login: function(email, password, success, failure) {
        $.ajax({
            url: '/api/users/login',
            type: 'POST',
            data: JSON.stringify({
                email: email,
                password: password,
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
				sr.models[page].refresh();
				break;
			case 'logout':
				sr.logout(
					function() { window.location = '/login' },
				 	function() { window.location = '/login' }
				);
			default:
				//window.location = '/login';
				break;
		};
		
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

			collection: [],
			single: {},

			refresh: function() { },

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

			collection: [],
			single: {},

			refresh: function() { }

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

				sr.actions.get_collection(
					'rides',
					sr.models['rides'].start,
					sr.models['rides'].count,
					function(resp) {
						console.log(resp);
						var rides = resp;
						var html = '';
						html += '<div class="button-holder">';
						if ( sr.models.rides.start != 0 )
							html += '<button class="left">&lt;&lt; Previous</button>';
						if ( rides.length == sr.models.rides.count )
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