
// UTILS

// taken from:
//   http://stackoverflow.com/a/32589289
function titleCase(str) {
   var splitStr = str.toLowerCase().replace('_',' ').split(' ');
   for (var i = 0; i < splitStr.length; i++) {
       // You do not need to check if i is larger than splitStr length, as your for does that for you
       // Assign it back to the array
       splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
   }
   // Directly return the joined string
   return splitStr.join(' '); 
}

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

  tabs: [
    'rides',
    'partners',
    'partner_levels',
    'checkins'
  ],

  service_hash_change() {
    var uri = location.hash.slice(1);
    console.log(uri);
    var parts = uri.split('/');
    if (parts.length == 2) {
      var tab = parts[1]
      console.log(parts);
      for (var i=0; i<sr.tabs.length; i++) {
        if (sr.tabs[i] == tab ) {
          sr.show_tab(sr.tabs[i]);
          return;
        }
      }
    }
    // invalid tab, go to default
    window.location.hash = '';
    sr.show_tab(sr.tabs[0]);
  },

  show_tab: function(tab) {
    sr.hide_all_tabs();
    $('#tab-' + tab).show();
  },

  hide_all_tabs: function() {
    for(var i=0; i<sr.tabs.length; i++) {
      $('#tab-' + sr.tabs[i]).hide();
    }
  },

  models: {

    // Users

    'users': {

      fields: {
        'first': 'text',
        'last': 'text',
        'email': 'email',
        'password': 'password',
        'is_admin': 'checkbox'
      },

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

    },

    // Partner Levels

    'partner_levels': {

      fields: {
        'title': 'text',
        'short_description': 'textarea',
        'description': 'textarea',
        'value': 'money'
      },

      collection: [],
      single: {},

      refresh: function(start, count) {
        sr.models['partner_levels'].get_collection(
          start,
          count,
          function(resp) {
            console.log('refresh(), success.');
            console.log(resp);
            sr.models['partner_levels'].collection = reps['partner_levels'];
          },
          function() {
            console.log('refresh(), error.');
            console.log(resp);
          }
        );
      },

      get: function(id, success, failure) {
        get('partner_levels', id, success, failsure);
      },

      get_collecton: function(start, count, success, failure) {
        get_collection('partner_levels', start, count, success, failure);
      },

      create: function(partner_level, success, failure) {
        create('partner_levels', partner_level, success, failure);
      },

      update: function(id, partner_level, success, failure) {
        update('partner_levels', id, partner_level, success, failure);
      }
    },

    // Partners

    'partners': {

      fields: {
        'name': 'text',
        'description': 'textarea',
        'address_0': 'text',
        'address_1': 'text',
        'city': 'text',
        'state': 'text',
        'zipcode': 'text',
        'partner_level': 'model',
        'notifiation_text': 'text',
        'geo_fence': 'geo_fence' 
      },

      collection: [],

      get: function(id, success, failure) {
        get('partners', id, success, failsure);
      },

      get_collection: function(start, count, success, failure) {
        get_collection('partners', start, count, success, failure);
      },

      create: function(partner, success, failure) {
        create('partners', partner, success, failure);
      },

      update: function(id, partner, success, failure) {
        update('partners', id, partner, success, failure);
      }
    },

    // Rides
    
    'rides': {

      fields: {
        'title': 'text',
        'description': 'textarea',
        'address_0': 'text',
        'address_1': 'text',
        'city': 'text',
        'state': 'text',
        'zipcode': 'text'
      },

      collection: [],
      single: {},

      get: function(id, success, failure) {
        get('rides', id, success, failure);
      },

      get_collection: function(start, count, success, failure) {
        get_collection('rides', start, count, success, failure);
      },

      create: function(ride, success, failure) {
        create('rides', ride, success, failsure);
      },

      update: function(id, ride, success, failure) {
        update('rides', id, ride, success, failure);
      }
    },

    // RideSponsors

    'ride_sponsors': {

      fields: {
        'ride': 'model',
        'partner': 'model'
      },

      collection: [],
      single: {},

      get: function(id, success, failure) {
        get('ride_sponsors', id, success, failure);
      },

      get_collection: function(start, count, success, failure) {
        get_collection('ride_sponsors', start, count, success, failure);
      },

      create: function(ride_sponsor, success, failure) {
        create('ride_sponsors', ride_sponsor, success, failure);
      },

      update: function(id, ride_sponsor, success, failure) {
        update('ride_sponsor', id, ride_sponsor, success, failure);
      }

    },

    // CheckIns

    'checkins': {

      fields: {
        'race': 'modal',
        'user': 'modal',
        'accepts_terms': 'boolean'
      },

      collection: [],
      single: {},

      get: function(id, success, failure) {
        get('checkins', id, success, failure);
      },

      get_collections: function(start, count, success, failure) {
        get_collection('checkins', start, count, success, failure);
      },

      create: function(checkins, success, failure) {
        create('checkins', checkins, success, failure);
      },

      update: function(id, checkins, success, failure) {
        update('checkins', id, checkins, success, failure);
      }

    }

  },

  // Dialogs

  build_dialog_fields: function(type, model, fields) {
    var html = '<h3>Create new ' + titleCase(model).slice(0, -1) + '</h3>';
    for(var key in fields) {
      var val = fields[key];
      var field = '<label>' + titleCase(key) + '</label>';
      switch(val) {
        case 'text':
          field += '<input id="dialog-' + model + '-' + key + '" type="text"></input>';
          break;
        case 'textarea':
          field += '<textarea id="dialog-' + model + '-' + key + '"></textarea>';
          break;
        case 'money':
          field += '<input id="dialog-' + model + '-' + key + '" type="text"></input>';
          break;
        default:
          // nothing good ...
          break;
      };
      html += field;
    }
    html += '<button id="dialog-' + type + '-cancel" class="right" onclick="$(\'#dialog-' + type + '-' + model + '\').foundation(\'reveal\',\'close\');">Cancel</button>';
    html += '<button id="dialog-' + type + '-submit">Submit</button>';
    return html;
  },

  dialog_create: function(model) {
    $('#dialog-new-inner').html(sr.build_dialog_fields('new', model, sr.models[model].fields));
    $('#dialog-new').foundation('reveal','open');
    $('#dialog-new-submit').on('click', function() {
      console.log('submit()');
      var fields = sr.models[model].fields;
      var payload = {}
      for(var key in fields) {
        payload[key] = $('#dialog-' + model + '-' + key).val();
      }
      sr.models[model].create(
        payload,
        function(resp) {
          console.log('dialog_create(), created model.');
          console.log(resp);
        },
        function() {
          consoe.log('dialog_create(), error.');
          console.log(resp);
        }
      );
    });
  },

  dialog_update: function(model, id, data) {
    $('#dialog-update-inner').html(sr.build_dialog_fields('update', model, sr.models[model].fields));
    $('#dialog-update').foundation('reveal','open');
    $('#dialog-update-submit').on('click', function() {
      console.log('submit()');
      sr.models[model].update(
        id,
        data, //payload,
        function(resp) {
          console.log('dialog_update(), created model.')
          console.log(resp);
        },
        function(resp) {
          console.log('dialog_update(), error.');
          console.log(resp);
        }
      );
    });

  }
 
}

