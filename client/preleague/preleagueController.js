app.controller('PreLeagueController', function($scope, $stateParams, preLeagueFactory){

  $scope.leagueId = $stateParams.leagueId;
  $scope.leagueName;

  $scope.getLeagueName = function(){
    preLeagueFactory.getName($scope.leagueId)
      .then(function(name){
        console.log('NAME NAME:', name)
        $scope.leagueName = name;
      })
  }

  $scope.pre = false;
  $scope.suspended = true;

  $scope.getLeagueName();

  // this is the start date, time of the league
  $scope.date;


})