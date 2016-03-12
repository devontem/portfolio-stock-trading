var app = angular.module('app')

app.controller('MessageBoardController', function($scope, messageBoardFactory, $rootScope, $window){

  $scope.posts;

  $scope.userPost = {};
  $scope.userPost.name = $window.localStorage.getItem('com.tp.user');
  $scope.userPost.userId = $window.localStorage.getItem('com.tp.user');


  $scope.messageBoardPost = function(){
    messageBoardFactory.submitPost($scope.userPost);
    messageBoardFactory.showPosts().then(function(posts){
      var posts = posts;
      $scope.posts = posts.data;
      $scope.userPost.message = '';
      $rootScope.$emit('scrollDown');
    });
  }

  $scope.leagueId;

  messageBoardFactory.showPosts().then(function(posts){
    var posts = posts;
    $scope.posts = posts.data;
    $scope.userPost.message = '';
  });

});