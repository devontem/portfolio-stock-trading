app.controller('MessageBoardController', function($scope, messageBoardFactory){

  $scope.posts = [
    {
      username: 'Sonny',
      message: 'hey hey hey'
    },
    {
      username: 'Jordan',
      message: 'Not much ...'
    },
    {
      username: 'Jonathon',
      message: 'Word to Big Bird'
    }
  ];

  $scope.leagueId;

  $scope.getMessageBoard = function(leagueId){
    // this will call a factory function to grab http data from server and assign returned data to $scope.members;
    messageBoardFactory.getPosts(leagueId).then(function(posts){
      $scope.posts = posts;
    })
  };

  // once we have league ID, call to initialize leaderboard
  //$scope.getLeaderBoard(leagueId);

});