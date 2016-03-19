app.controller('BadgeController', ['$scope', 'BadgeFactory', '$window', function($scope, BadgeFactory, $window){
  var userId = $window.localStorage.getItem('com.tp.userId');
  $scope.badges = ['Sign In', 'Joined First League', 'Won First League', 'Made Your First Mil'];
  $scope.getBadges = function () {
    BadgeFactory.getBadges(userId).then(
      function (res) {
        console.log('******', res);
      }
    );
  };
  // $scope.getBadges();
  $scope.postBadge = function (userId, badge) {
    BadgeFactory.postBadge(userId, badge);
  };

  $scope.postBadge(1, 2);
  $scope.postBadge(1, 3);
  $scope.postBadge(1, 4);
  $scope.getBadges();
}]);
