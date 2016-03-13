var app = angular.module('app')

app.controller('MessageBoardController', function($scope, messageBoardFactory, $rootScope, $window, $stateParams){

  $scope.posts;

  $scope.userPost = {};
  $scope.userPost.name = $window.localStorage.getItem('com.tp.username');
  $scope.userPost.leagueId = $stateParams.leagueId;

  $scope.messageBoardPost = function(){

    messageBoardFactory.submitPost($scope.userPost);
    messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
      var posts = posts;
      $scope.posts = posts.data;
      console.log(posts);
      $scope.userPost.message = '';
      $rootScope.$emit('scrollDown');
    });
  }

  $scope.leagueId;

  messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
    var posts = posts;
    $scope.posts = posts.data;
    $scope.userPost.message = '';
  });

});