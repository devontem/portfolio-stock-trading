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

.controller('DashboardController', ['$scope', '$window', 'DashboardFactory', function ($scope, $window, DashboardFactory) {

  $scope.userLeagues = [{name:"league1", userRank: 2, percentChange: -1.3, gainLoss: '123.00', totalValue: 14000, changeYesterday: 2.5}, {name:"league2", userRank: 17, percentChange: 15, gainLoss: '2000', totalValue: 9888, changeYesterday: 2.5}, {name:"league3", userRank: 1, percentChange: 2.5, gainLoss: '12.00', totalValue: 9012, changeYesterday: 2.5}];
  $scope.leaguesToJoin = [{name:"league4", userRank: 2, percentChange: -1.3, gainLoss: '123.00', totalValue: 14000, changeYesterday: 2.5}, {name:"league5", userRank: 17, percentChange: 15, gainLoss: '2000', totalValue: 9888, changeYesterday: 2.5}, {name:"league6", userRank: 1, percentChange: 2.5, gainLoss: '12.00', totalValue: 9012, changeYesterday: 2.5}];

  $scope.currentTab = 'user';
  $scope.leagues;
  $scope.league = {};
  $scope.portfolios = {}

  //toggle add form
  $scope.showadd = false;
  $scope.toggleAdd = function(){
    $scope.showadd = !$scope.showadd;
  }

  $scope.addLeague = function (league) {

    var creatorName = $window.localStorage.getItem('com.tp.username');
    var creatorId = $window.localStorage.getItem('com.tp.user');
    league['creatorId']= creatorId;
    league['creatorName']= creatorName;
    console.log(league,'%%league1%%') 
    DashboardFactory.addLeague(league)
      .then(function(){
        $scope.toggleAdd();
        $window.location.href = '/#/dashboard'
      });
  }

  // $scope.filter = function () {
  //   if($scope.portfolios.UserId !== )
  // }

  $scope.showToJoin = function () {
    $scope.currentTab = 'toJoin';

  }

  $scope.showUserLeagues = function () {
    $scope.currentTab = 'user';
  }

  $scope.getUserLeagues = function () {
    
    DashboardFactory.getUserLeagues(userId)
      .then(function(portfolios){
        $scope.portfolios = portfolios;
        console.log($scope.portfolios,'fasfsfsfasf')
      });
  }

  $scope.joinLeague = function (leagueId) {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.joinLeague(leagueId, userId)
      .then(function(){
        $window.location.href = '/#/league'
        // $window.location.href = '/#/leagues/:'+leagueId;
      })
  }
//returns all public leagues
  $scope.getLeaguesToJoin = function () {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.getAvailLeagues()
      .then(function(leagues){

        console.log(leagues,'league')
        $scope.leagues = leagues;
      })
    // TODO: connect to factory to get leagues to join
  }

  $scope.getUserLeagues();
  $scope.getLeaguesToJoin();
  // TODO: Call both of the above functions to get relevant league data for the views on initialization
}])
