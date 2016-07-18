if(!XENTHA) {
  console.log('no xentha object found');
  console.err('no xentha object found');
}

var USER_ROUTE = '/users';

var login = function(username, password) {
  var data = {};
  var dataArray = $("#loginForm").serializeArray();
  $(dataArray).each(function(pos, obj) {
   data[obj.name] = obj.value;
  });

  if(data.username && data.password) {
    $.post('http://' + XENTHA.settings.api + USER_ROUTE + '/login', { 'user': {'username': data.username, 'password': data.password }})
    .done(function( data ) {
      if(data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        XENTHA.vars.user = data.user;
        init();
      }
    });
  } else {
    console.log('enter username and password');
  }
}

var logout = function() {
  localStorage.setItem('user', null);
  init();
}

var register = function() {
  // var form = document.getElementById('registerForm');
  var data = {};
  var dataArray = $("#registerForm").serializeArray();
  $(dataArray).each(function(pos, obj) {
   data[obj.name] = obj.value;
  });
  // var data = {username: username, password: password, firstname: firstname, lastname: lastname};

  if(data.username && data.password) {
    $.post('http://' + XENTHA.settings.api + USER_ROUTE, {'user': data})
    .done(function( data ) {
      console.log(data);
      if(data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        XENTHA.vars.user = data.user;
      }
    });
  } else {
    console.log('enter username and password');
  }
}

var user = localStorage.getItem('user');
