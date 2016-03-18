app
  .factory('BadgeFactory', ['$http', function ($http) {
    var getBadges = function(){
      // pass in user id
      return $http({
        method: 'GET',
        url: '/api/badges',
        // data: userId
      })
      .then(function(badges){
        console.log('******',badges);
        return badges;
      });
    };

    return {
      getBadges: getBadges
    };
  }]);
