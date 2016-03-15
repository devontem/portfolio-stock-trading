app.controller('LeagueController', ['$scope', '$stateParams', 'DashboardFactory', function($scope, $stateParams, DashboardFactory){
  //Gets the league
  var leagueId = $stateParams.leagueId;

  $scope.test = function () {
    console.log('hi ted');
    DashboardFactory.getLeagueById(leagueId)
    .then(function(league){
      $scope.league = league;
      console.log('************************',$scope.league);
    })
  };

  $scope.test();

  // initialize a flag indicating that the league has not started yet
  $scope.hasStarted = false;
  // grab the current moment using moment.js
  var currentMoment = moment();

  var checkStart = function () {
    console.log('************************',$scope.league);
  };
  // checkStart();
}]);