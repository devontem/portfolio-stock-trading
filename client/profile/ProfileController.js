angular.module('app.profile', [])

.controller('ProfileController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'AccountFactory', 'DirectMessage', function($scope, $window, $stateParams, DashboardFactory, AccountFactory, DirectMessage){
	$scope.id = $stateParams.userId;
	$scope.username = $window.localStorage.getItem('com.tp.username');

	$scope.getUserLeagues = function () {
    DashboardFactory.getUserLeagues($scope.id)
      .then(function(portfolios){
        $scope.portfolios = portfolios;
      });
  };

  $scope.getLeaguesByOwnerId = function(){
    AccountFactory.getLeaguesByOwnerId($scope.id).then(function(data){
      $scope.leagues = data;
    });
  };

  // This functions needs to be created
  $scope.getLeaguesWonById = function(){
  	$scope.leaguesWon = [];
  };

  $scope.getUser = function(){
    AccountFactory.getSingleUser($scope.id)
      .then(function(user){
        $scope.user = user;
        $scope.email = user.email;
        $scope.image = user.image || '../assets/img/no-avatar.png';
      });
  };

  $scope.sendMessage = function(){
    DirectMessage.setSendTo($scope.user);
    $window.location.href = '/#/messages';
  }

  $scope.getUser();

  $scope.getLeaguesWonById();
  $scope.getLeaguesByOwnerId();
  $scope.getUserLeagues();
}]);
