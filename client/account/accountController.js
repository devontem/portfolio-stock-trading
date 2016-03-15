app.controller('AccountController', function($scope, $window, AccountFactory, $location, $rootScope){

  $scope.name = $window.localStorage.getItem('com.tp.username');
  $scope.id = $window.localStorage.getItem('com.tp.userId');

  console.log($scope.id)

  $scope.delete = function(){
    AccountFactory.deleteAccount($scope.id);
    $location.path('/');

    $rootScope.$emit('deleted', {});
  }

  $scope.newlogin = {};
  $scope.newlogin.userId = $scope.id;
  $scope.change = false;

  $scope.edit = function(){
    $scope.change = true;
  }

  $scope.cancel = function(){
    $scope.change = false;
  }

  $scope.updateLogin = function(){
    console.log('clicked')
    AccountFactory.editLogin($scope.newlogin);
  }

})