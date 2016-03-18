app.controller('BadgeController', ['$scope', 'BadgeFactory', function($scope, BadgeFactory){
  $scope.test = 100;
  $scope.badges = ['Sign In', 'Joined First League', 'Won First League', 'Made Your First Mil'];
  $scope.routeTest = function () {
    BadgeFactory.getBadges();
    BadgeFactory.postBadge('100 Games Won', 'Jojo');
  };
  $scope.routeTest();
}]);
