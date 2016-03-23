app.controller('PreLeagueController', ['$scope', '$stateParams', 'preLeagueFactory', 'DashboardFactory', function($scope, $stateParams, preLeagueFactory, DashboardFactory){

  $scope.leagueId = $stateParams.leagueId;
  $scope.leagueName;

  $scope.getLeagueName = function(){
    preLeagueFactory.getName($scope.leagueId)
      .then(function(name){
        $scope.leagueName = name;
      });
  };

  $scope.pre = true;
  $scope.suspended = false;

  $scope.getLeagueName();

  $scope.leagueInfo;

  $scope.getLeagueById = function(){
    DashboardFactory.getLeagueById($scope.leagueId).then(function(data){
      $scope.leagueInfo = data;
    });
  };

  $scope.getLeagueName();
  $scope.getLeagueById();

}]);
