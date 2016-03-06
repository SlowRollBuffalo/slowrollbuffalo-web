
// GET (id)
function get(model, id, success, failure) {
  $.ajax({
    url: '/api/' + model + '/' + id,
    type: 'GET',
    success: function(resp) { success(resp); },
    error: function() { failure(resp); }
  });
}

// GET
function get_collection(model, start, count, success, failure) {
  $.ajax({
    url: '/api/' + model + '?start=' + start + '&count=' + count,
    type: 'GET',
    success: function(resp) { success(resp); },
    failure: function(resp) { failure(resp); }
  });
}

// POST
function create(model, thing, success, failure) {
  $.ajax({
    url: '/api/' + model,
    type: 'POST',
    data: JSON.stringify(thing),
    success: function(resp) { success(resp); },
    failure: function(resp) { failsure(resp); }
  });
}

// PUT
function update(model, id, thing, success, failure) {
  $.ajax({
    url: '/api/' + model + '/' + id,
    type: 'PUT',
    data: JSON.stringify(thing),
    success: function(resp) { success(resp); },
    failure: function(resp) { failsure(resp); }
  });
}

// DELETE
function remove(url, thing, success, failure) {
  $.ajax({
    url: '/api/' + model + '/' + id,
    type: 'DELETE',
    success: function(resp) { success(resp); },
    failure: function(resp) { failsure(resp); }
  });
}

var sr = {

  login: function(email, password, success, failure) {
    $.ajax({
      url: '/api/users/login',
      type: 'POST',
      data: JSON.stringify({
        email: email,
        password: password,
      }),
      success: function(resp) {
        success(resp);
      },
      error: function(resp) {
        failure(resp);
      }
    });
  },

  logout: function(success, failure) {
    $.ajax({
      url: '/api/users/logout',
      type: 'POST',
      success: function(resp) {
        success(resp);
      },
      error: function(resp) {
        failure(resp);
      }
    });
  },

  // Users

  get_user: function(id, success, failure) {
    get('users', id, success, failure);
  },

  get_users: function(start, count, success, failure) {
    get_collection('users', start, count, success, failsure)
  },

  create_user: function(user, success, failure) {
    create('users', user, success, failsure);
  },

  update_user: function(id, user, success, failure) {
    update('users', id, user, success, failsure);
  },

  // Partner Levels

  get_partner_level: function(id, success, failure) {
    get('partner_levels', id, success, failsure);
  },

  get_partner_levels: function(start, count, success, failure) {
    get_collection('partner_levles', start, count, success, failure);
  },

  create_partner_level: function(partner_level, success, failure) {
    create('partner_levels', partner_level, success, failure);
  },

  update_partner_level: function(id, partner_level, success, failure) {
    update('partner_levels', id, partner_level, success, failure);
  },

  // Partners

  get_partner: function(id, success, failure) {
    get('partners', id, success, failsure);
  },

  get_partners: function(start, count, success, failure) {
    get_collection('partners', start, count, success, failure);
  },

  create_partner: function(partner, success, failure) {
    create('partners', partner, success, failure);
  },

  update_partner: function(id, partner, success, failure) {
    update('partners', id, partner, success, failure);
  },

  // Rides

  get_ride: function(id, success, failure) {
    get('rides', id, success, failure);
  },

  get_rides: function(start, count, success, failure) {
    get_collection('rides', start, count, success, failure);
  },

  create_ride: function(ride, success, failure) {
    create('rides', ride, success, failsure);
  },

  update_ride: function(id, ride, success, failure) {
    update('rides', id, ride, success, failure);
  },

  // RideSponsors

  get_ride_sponsors: function(id, success, failure) {
    get('ride_sponsors', id, success, failure);
  },

  get_ride_sponsors: function(start, count, success, failure) {
    get_collection('ride_sponsors', start, count, success, failure);
  },

  create_ride_sponsor: function(ride_sponsor, success, failure) {
    create('ride_sponsors', ride_sponsor, success, failure);
  },

  update_ride_sponsor: function(id, ride_sponsor, success, failure) {
    update('ride_sponsor', id, ride_sponsor, success, failure);
  },

  // CheckIns

  get_checkins: function(id, success, failure) {
    get('checkins', id, success, failure);
  },

  get_checkins: function(start, count, success, failure) {
    get_collection('checkins', start, count, success, failure);
  },

  create_checkins: function(checkins, success, failure) {
    create('checkins', checkins, success, failure);
  },

  update_checkins: function(id, checkins, success, failure) {
    update('checkins', id, checkins, success, failure);
  },

  // Dialogs

  modal_new_thing: function(model, fields) {
    $('#modal-new-thing').foundation('reveal','open'); 
  }
  
};
