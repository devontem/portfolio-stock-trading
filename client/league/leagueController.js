app.controller('LeagueController', ['$scope', '$stateParams', 'DashboardFactory', function($scope, $stateParams, DashboardFactory){
  //Gets the league
  var leagueId = $stateParams.leagueId;

  // initialize a flag indicating that the league has not started yet
  $scope.hasStarted = false;
  // grab the current moment using moment.js
  var currentMoment = moment().utc();

  $scope.checkStart = function (league) {
    var start = moment(league.start).utc();
    console.log('&23948723984723987', start);
    console.log('))))))))))))))', currentMoment);
    console.log(currentMoment.isValid());
    if (currentMoment.isBefore(start)) {
      console.log('&&&&&&&&&&&&&&&&&&&');
    } else {
      console.log('doink');
    }
  };

  DashboardFactory.getLeagueById(leagueId)
    .then(function(league){
      $scope.league = league;
      $scope.checkStart($scope.league);
    });


}]);
