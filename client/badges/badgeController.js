app.controller('BadgeController', ['$scope', 'BadgeFactory', '$window', function($scope, BadgeFactory, $window){
  var userId = $window.localStorage.getItem('com.tp.userId');
  $scope.badges = ['Sign In', 'Joined First League', 'Won First League', 'Made Your First Mil'];
  $scope.getBadges = function () {
    BadgeFactory.getBadges(userId);
  };
  // $scope.getBadges();
  $scope.postBadge = function (userId, badge) {
    BadgeFactory.postBadge(userId, badge);
  };

  $scope.postBadge(1, 'test badge');
  $scope.postBadge(1, 'test badge number 2');
  $scope.postBadge(1, 'test badge number 3');

}]);
