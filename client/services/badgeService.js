app
  .factory('BadgeFactory', ['$http', function ($http) {
    var addLeague = function(userId){
      return $http({
        method: 'GET',
        url: '/api/badges',
        data: userId
      })
      .then(function(badges){
        return badges.data;
      });
    };
  }]);
