var app = angular.module('app')

app.controller('MessageBoardController', function($scope, messageBoardFactory){

  $scope.posts;

  $scope.userPost = {};
  $scope.userPost.name = 'Sonny'

  $scope.messageBoardPost = function(){
    messageBoardFactory.submitPost($scope.userPost);
    messageBoardFactory.showPosts().then(function(posts){
      var posts = posts;
      $scope.posts = posts.data;
      $scope.userPost.message = '';
    });
  }

  $scope.leagueId;


});