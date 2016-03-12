angular.module('app.profile', [])

.controller('ProfileController', ['$scope', function ($scope) {

  $scope.userLeagues = [{name:"league1", userRank: 2, percentChange: -1.3, gainLoss: '123.00', totalValue: 14000, changeYesterday: 2.5}, {name:"league2", userRank: 17, percentChange: 15, gainLoss: '2000', totalValue: 9888, changeYesterday: 2.5}, {name:"league3", userRank: 1, percentChange: 2.5, gainLoss: '12.00', totalValue: 9012, changeYesterday: 2.5}];
  $scope.leaguesToJoin = [{name:"league4", userRank: 2, percentChange: -1.3, gainLoss: '123.00', totalValue: 14000, changeYesterday: 2.5}, {name:"league5", userRank: 17, percentChange: 15, gainLoss: '2000', totalValue: 9888, changeYesterday: 2.5}, {name:"league6", userRank: 1, percentChange: 2.5, gainLoss: '12.00', totalValue: 9012, changeYesterday: 2.5}];

  $scope.currentTab = 'user';

  $scope.showToJoin = function () {
    $scope.currentTab = 'toJoin';

  }

  $scope.showUserLeagues = function () {
    $scope.currentTab = 'user';
  }

  $scope.getUserLeagues = function () {
    // TODO: this will connect to a factory to pull leagues user is in
    return;
  }

  $scope.getLeaguesToJoin = function () {
    // TODO: connect to factory to get leagues to join
    return;
  }
  // TODO: Call both of the above functions to get relevant league data for the views on initialization
}])
