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

  $scope.currentTab = 'user';
  $scope.leagues;
  $scope.league = {};
  $scope.portfolios = {};
  $scope.numtojoin = 0;

  //toggle add form
  $scope.showadd = false;
  $scope.toggleAdd = function(){
    $scope.showadd = !$scope.showadd;
  }

  $scope.addLeague = function (league) {

    var creatorName = $window.localStorage.getItem('com.tp.username');
    var creatorId = $window.localStorage.getItem('com.tp.userId');
    league['creatorId']= creatorId;
    league['creatorName']= creatorName;
    DashboardFactory.addLeague(league)
      .then(function(league){
        $scope.toggleAdd();
        $window.location.href = '/#/leagues/'+league.id
      });
  }

  

  $scope.showToJoin = function () {
    $scope.currentTab = 'toJoin';

  }

  $scope.showUserLeagues = function () {
    $scope.currentTab = 'user';
  }

  $scope.getUserLeagues = function () {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.getUserLeagues(userId)
      .then(function(portfolios){
        $scope.portfolios = portfolios;
      });
  }

  $scope.joinLeague = function (leagueId) {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.joinLeague(leagueId, userId)
      .then(function(){
        $window.location.href = '/#/leagues/'+leagueId.toString()
      })
  }
//returns all public leagues
  $scope.getLeaguesToJoin = function () {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.getAvailLeagues()
      .then(function(leagues){
        $scope.leagues = leagues;
        $scope.numtojoin = $scope.leagues.length - $scope.portfolios.length;
      })
    // TODO: connect to factory to get leagues to join
  }

  $scope.notjoined = function(league){
    for(var i=0; i<$scope.portfolios.length; i++){
      if(league.id === $scope.portfolios[i].leagueId) return false;
    }
    return true;
  }

  $scope.getUserLeagues();
  $scope.getLeaguesToJoin();
  // TODO: Call both of the above functions to get relevant league data for the views on initialization
}])
