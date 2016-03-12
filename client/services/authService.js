app.factory('Auth', function($http, $location){

  var createuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    })
    .then(function(data){
      return data;
    });
  };

  var loginuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function(data){
      return data;
    })
  }

  var isAuth = function() {
    return !!$window.localStorage.getItem('com.tp');
  };

  return {
    isAuth: isAuth,
    createuser: createuser,
    loginuser: loginuser
  };

});