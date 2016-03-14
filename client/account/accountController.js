app.controller('AccountController', function($scope, $window, AccountFactory, $location){

  $scope.name = $window.localStorage.getItem('com.tp.username');
  $scope.id = $window.localStorage.getItem('com.tp.userId');

  $scope.delete = function(){
    AccountFactory.deleteAccount($scope.id);
    $location.path('/');
  }

})