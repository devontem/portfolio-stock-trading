app.controller('LeaderBoardController', function($scope, leaderBoardService){

  // members will be an object of each member in the league
  // containing name, portfolio value, and other stats
  // desired to go on the leaderboard
  $scope.members;
  $scope.leagueId;

  $scope.getLeaderBoard = function(leagueId){
    // this will call a factory function to grab http data from server and assign returned data to $scope.members;
    leaderBoardService.getMembers(leagueId).then(function(members){
      $scope.members = members;
    })
  };

  // once we have league ID, call to initialize leaderboard
  //$scope.getLeaderBoard(leagueId);

});