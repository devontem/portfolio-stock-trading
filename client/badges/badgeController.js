app.controller('BadgeController', ['$scope', 'BadgeFactory', '$window', function($scope, BadgeFactory, $window){
  var userId = $window.localStorage.getItem('com.tp.userId');
  $scope.badges = ['Sign In', 'Joined First League', 'Won First League', 'Made Your First Mil'];
  $scope.getBadges = function () {
    BadgeFactory.getBadges(userId);
    BadgeFactory.postBadge(userId, 25);
  };
  $scope.getBadges();
}]);
