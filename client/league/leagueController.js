app.controller('LeagueController', ['$scope', '$stateParams', 'DashboardFactory', function($scope, $stateParams, DashboardFactory){
  //Gets the league
  var leagueId = $stateParams.leagueId;

  DashboardFactory.getLeagueById(leagueId)
    .then(function(league){
      console.log('started');
      $scope.league = league;
      console.log('************************',$scope.league);
    });

  // initialize a flag indicating that the league has not started yet
  $scope.hasStarted = false;
  // grab the current moment using moment.js
  var currentMoment = moment();

  var checkStart = function () {
    console.log('************************',$scope.league);
  };
  // checkStart();
}]);
