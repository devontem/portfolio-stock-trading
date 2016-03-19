app.controller('BadgeController', ['$scope', 'BadgeFactory', '$window', function($scope, BadgeFactory, $window){
  var userId = $window.localStorage.getItem('com.tp.userId');
  $scope.badges = [];

  $scope.getBadges = function () {
    BadgeFactory.getBadges(userId).then(
      function (res) {
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          $scope.badges.push(badgeFormatted);
        });
      }
    );
  };

  $scope.postBadge = function (userId, badge) {
    BadgeFactory.postBadge(userId, badge);
  };

  $scope.postBadge(1, 2);
  $scope.postBadge(1, 3);
  $scope.postBadge(1, 4);
  // loads all badges that the user has earned so far
  $scope.getBadges();
}]);
