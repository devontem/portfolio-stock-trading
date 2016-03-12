angular.module('app.dashboard', [])

.directive('addleagueDirective', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width) {
        scope.dialogStyle.width = attrs.width;
      }
      if (attrs.height) {
        scope.dialogStyle.height = attrs.height;
      }
      scope.hideadd = function() {
        scope.show = false;
      }
    },
    transclude: true,
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideadd()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  }
})

.controller('DashboardController', ['$scope', 'DashboardFactory', function ($scope, DashboardFactory) {

  $scope.userLeagues = [{name:"league1", userRank: 2, percentChange: -1.3, gainLoss: '123.00', totalValue: 14000, changeYesterday: 2.5}, {name:"league2", userRank: 17, percentChange: 15, gainLoss: '2000', totalValue: 9888, changeYesterday: 2.5}, {name:"league3", userRank: 1, percentChange: 2.5, gainLoss: '12.00', totalValue: 9012, changeYesterday: 2.5}];
  $scope.leaguesToJoin = [{name:"league4", userRank: 2, percentChange: -1.3, gainLoss: '123.00', totalValue: 14000, changeYesterday: 2.5}, {name:"league5", userRank: 17, percentChange: 15, gainLoss: '2000', totalValue: 9888, changeYesterday: 2.5}, {name:"league6", userRank: 1, percentChange: 2.5, gainLoss: '12.00', totalValue: 9012, changeYesterday: 2.5}];

  $scope.currentTab = 'user';

  $scope.league = {}
  //toggle add form
  $scope.showadd = false;
  $scope.toggleAdd = function(){
    $scope.showadd = !$scope.showadd;
  }

  $scope.addLeague = function (league) {
    DashboardFactory.addLeague(league);
  }

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
