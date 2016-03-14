app.controller('AccountController', function($scope, $window){

  $scope.name = $window.localStorage.getItem('com.tp.username');


})