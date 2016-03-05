
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
  }

};
