app.controller('PreLeagueController', ['$scope', '$stateParams', 'preLeagueFactory', 'DashboardFactory', function($scope, $stateParams, preLeagueFactory, DashboardFactory){

  $scope.leagueId = $stateParams.leagueId;
  $scope.leagueName;

  $scope.getLeagueName = function(){
    preLeagueFactory.getName($scope.leagueId)
      .then(function(name){
        console.log('NAME???', name)
        $scope.leagueName = name;
      });
  };

  $scope.pre = true;
  $scope.suspended = false;

  $scope.getLeagueName();

  // this is the start date, time of the league
  $scope.date;

  $scope.leagueInfo;

  $scope.getLeagueById = function(){
    DashboardFactory.getLeagueById($scope.leagueId).then(function(data){
      console.log('DATATATATAT', data)
      $scope.leagueInfo = data;
    });
  };

  $scope.getLeagueName();
  $scope.getLeagueById();

}]);
