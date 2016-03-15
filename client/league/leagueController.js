app.controller('LeagueController', ['$scope', '$stateParams', 'DashboardFactory', function($scope, $stateParams, DashboardFactory){
  //Gets the league
  var leagueId = $stateParams.leagueId;

  // initialize a flag indicating that the league has not started yet
  $scope.hasStarted = false;
  $scope.hasEnded = false;
  // grab the current moment using moment.js
  var currentMoment = moment().utc();

  $scope.checkStart = function (league) {
    var start = moment(league.start).utc();
    if (currentMoment.isBefore(start)) {
      $scope.hasStarted = false;
    } else {
      $scope.hasStarted = true;
      // TODO: add this to the databse
    }
  };

  $scope.checkEnd = function (league) {
    var end = moment(league.end).utc();
    if (currentMoment.isAfter(end)) {
      $scope.hasEnded = true;
    } else {
      $scope.hasEnded = false;
      // TODO: add this to the databse
    }
  };

  DashboardFactory.getLeagueById(leagueId)
    .then(function(league){
      $scope.league = league;
      // TODO: make this run conditionally
      // if (league.hasStarted === false ) {
      //   run the checkStart
      // }
      $scope.checkStart($scope.league);
      $scope.checkEnd($scope.league);
    });


}]);
