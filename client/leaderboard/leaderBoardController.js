app.controller('LeaderBoardController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'leaderBoardFactory', '$location', '$rootScope' ,function($scope, $window, $stateParams, DashboardFactory, leaderBoardFactory, $location, $rootScope){

  $scope.leagueId = $stateParams.leagueId;
  $scope.portfolios;
  $scope.leagueName;
  $scope.userId = $window.localStorage.getItem('com.tp.userId');

  //get all portfolios in certain league
  $scope.getLeaderBoard = function(){
    // this will call a factory function to grab http data from server and assign returned data to $scope.members;
    leaderBoardFactory.getPortfolios($scope.leagueId)
      .then(function(portfolios){

        var joined = false;
        for(var i=0; i<portfolios.length; i++){
          if(portfolios[i].UserId === Number($scope.userId)) joined = true;
        }
        if(!joined) {
          $window.location.href = '/#/dashboard';
          Materialize.toast('You are not in the league.',1000);
        }

        $scope.portfolios = portfolios;
        $scope.leagueName = portfolios[0].leaguename;
        $scope.code = portfolios[0].code;
      });
  };

  //get private league code
  $scope.getLeagueById = function(){
    DashboardFactory.getLeagueById($scope.leagueId).then(function(data){
      $scope.secretCode = data.code;
    });
  };

  // once we have league ID, call to initialize leaderboard
  $scope.getLeagueById();
  $scope.getLeaderBoard();

  // to update the leaderboard when users makes portfolio trxn
  $rootScope.$on("PortfolioUpdate", function(){
    $scope.getLeaderBoard();
  });
}]);
