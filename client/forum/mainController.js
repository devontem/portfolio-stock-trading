var app = angular.module('app')

app.controller('MainForumController', ['$scope', function($scope){

  $scope.openModal = function(){
    $('#createForumPost').openModal();
  }

}])