app
  .factory('BadgeFactory', ['$http', function ($http) {
    var getBadges = function(userId){
      return $http({
        method: 'GET',
        url: '/api/badges',
        data: userId
      })
      .then(function(badges){
        return badges.data;
      });
    };

    return {
      getBadges: getBadges
    };
  }]);
