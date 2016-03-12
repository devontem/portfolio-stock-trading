app

  .factory('DashboardFactory', function($http){

    var getUserLeagues = function(user){
      return $http({
        method: 'GET',
        url: '/api/',
        data: user
      })
      .then( function (data) {
        // TODO: Structure this appropriately once you have the exact route
        return data;
      }
      );
    };

    var getAvailLeagues = function(){
      return $http({
        method: 'GET',
        url: '/api/leagues/'
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues;
      });
    };

    return {
      getUserLeagues: getUserLeagues,
      getAvailLeagues: getAvailLeagues
    };

  })
