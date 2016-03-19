var app = angular.module('app')

app.controller('TopicController', ['$scope', function($scope){

  $scope.replyClicked = false;

  $scope.reply = function(){
    $scope.replyClicked = true;
  }

  $scope.cancelReply = function(){
    $scope.replyClicked = false;
  }

}])