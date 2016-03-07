
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
    sr.models.refresh(tab);
  },

  hide_all_tabs: function() {
    for(var i=0; i<sr.tabs.length; i++) {
      $('#tab-' + sr.tabs[i]).hide();
    }
  },

  models: {

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
      $.ajax({
        url: '/api/' + model,
        type: 'POST',
        data: JSON.stringify(thing),
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

    refresh: function(model, start, count) {
      if ( start == undefined || start == null )
        start = 0;
      if ( count == undefined || count == null )
        count = 0;
      sr.models.get_collection(
        model,
        start,
        count,
        function(resp) {
          console.log('refresh(), success.');
          console.log(resp);
          sr.models[model].collection = resp[model];
          sr.models[model].refresh();
        },
        function() {
          console.log('refresh(), error.');
          console.log(resp);
        }
      );
    },


    // Users

    'users': {

      fields: {
        'first': 'text',
        'last': 'text',
        'email': 'email',
        'password': 'password',
        'is_admin': 'checkbox'
      },

      collection: [],
      single: {},

      refresh: function() { },

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

      refresh: function() {
        var rides = sr.models['rides'].collection;
        var html = '';
        html =  '<table><tbody>';
        html += '<thead><tr><th style="width: 10%;"></th><th style="width: 30%;">Title</th><th style="width: 30%;">Address</th><th style="width: 30%;">Partner</th></thead>';
        for(var i=0; i<rides.length; i++) {
          html += '<tr>';
          html += '  <td>';
          html += '    <a id="edit-ride-' + rides[i].id + '" class="fa-table-link"><i class="fa fa-pencil-square-o link-edit"></i></a>';
          html += '    <a id="edit-ride-' + rides[i].id + '" class="fa-table-link"><i class="fa fa-ban link-cancel"></i></a>';
          html += '  </td>';
          html += '  <td>' + rides[i].title + '</td>';
          html += '  <td>' + rides[i].address_0 + '</td>';
          html += '  <td></td>';
          html += '</tr>';
        }
        html += '</tbody></table>';
        $('#rides-list').html(html);
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
    html += '<button id="dialog-' + type + '-cancel" class="right" onclick="$(\'#dialog-' + type + '\').foundation(\'reveal\',\'close\');">Cancel</button>';
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
      sr.models.create(
        model,
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
        model,
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

