app.controller('LeaderBoardController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'leaderBoardFactory', '$location', '$rootScope' ,function($scope, $window, $stateParams, DashboardFactory, leaderBoardFactory, $location, $rootScope){

  // members will be an object of each member in the league
  // containing name, portfolio value, and other stats
  // desired to go on the leaderboard
  $scope.members = [
    {
      username: 'Sonny',
      value: 15000,
      return: '10%',
      transactions: 25
    },
    {
      username: 'Ted',
      value: 9000,
      return: '20%',
      transactions: 45
    },
    {
      username: 'Devonte',
      value: 3567,
      return: '6%',
      transactions: 5
    }
  ];

  $scope.leagueId = $stateParams.leagueId;
  $scope.portfolios;
  $scope.leagueName;
  $scope.userId = $window.localStorage.getItem('com.tp.userId');

  $scope.getLeaderBoard = function(){
    // this will call a factory function to grab http data from server and assign returned data to $scope.members;
    leaderBoardFactory.getPortfolios($scope.leagueId)
      .then(function(portfolios){
        //var userId = $window.localStorage.getItem('com.tp.userId');
        var joined = false;
        for(var i=0; i<portfolios.length; i++){
          if(portfolios[i].UserId === Number($scope.userId)) joined = true;
          console.log(portfolios[i].UserId, Number($scope.userId) )
        }
        if(!joined) {
          $window.location.href = '/#/dashboard';
          Materialize.toast('You are not in the league.',1000);
        }
        console.log('********' , joined)
        $scope.portfolios = portfolios;
        $scope.leagueName = portfolios[0].leaguename;
        $scope.code = portfolios[0].code;
      });
  };

  $scope.getLeagueById = function(){
    DashboardFactory.getLeagueById($scope.leagueId).then(function(data){
      $scope.secretCode = data.code;
    });
  };

  $scope.getLeagueById();
  $scope.getLeaderBoard();
  // once we have league ID, call to initialize leaderboard
  //$scope.getLeaderBoard(leagueId);
  $rootScope.$on("PortfolioUpdate", function(){
    $scope.getLeaderBoard();
  });
}]);
