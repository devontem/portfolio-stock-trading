app.controller('LeaderBoardController', function($scope){

  // members will be an object of each member in the league
  // containing name, portfolio value, and other stats
  // desired to go on the leaderboard
  $scope.members;

  $scope.getLeaderBoard = function(){
    // this will call a factory function to grab http data from server and assign returned data to $scope.members;
  };

  $scope.updateLeaderBoard = function(){
    // this will call a factory function to update the leaderboard, e.g., updating ranking, stats, as well reflecting a change when a member leaves the league;
  }


});