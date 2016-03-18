app
  .factory('BadgeFactory', ['$http', function ($http) {
    var getBadges = function(userId){
      return $http({
        method: 'POST',
        url: '/api/badges/getBadges',
        data: {userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    var postBadge = function(badge, userId){
      return $http({
        method: 'POST',
        url: '/api/badges',
        data: {badge: badge, userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    return {
      getBadges: getBadges,
      postBadge: postBadge
    };
  }]);
