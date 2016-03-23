app.controller('BadgeController', ['$scope', 'BadgeFactory', '$window', function($scope, BadgeFactory, $window){
  var userId = $window.localStorage.getItem('com.tp.userId');
  $scope.badges = [];
  $scope.possibleBadges = [];

  $scope.tooltipper = function () {
      $('tooltipped').tooltip({delay: 50});
  };

  $scope.getBadges = function () {
    BadgeFactory.getBadges(userId).then(
      function (res) {
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.badges.push(badgeFormatted);
          $scope.tooltipper();
        });
      }
    );
  };

  $scope.getPossibleBadges = function () {
    BadgeFactory.getPossibleBadges(userId).then(
      function (res) {
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.possibleBadges.push(badgeFormatted);
        });
        $scope.tooltipper();
      }
    );
  };


  // $scope.postBadge = function (userId, badge) {
  //   BadgeFactory.postBadge(userId, badge);
  // };

  // loads all badges that the user has earned so far
  $scope.getBadges();
  // loads all badges that the user has not earned
  $scope.getPossibleBadges();
}]);
