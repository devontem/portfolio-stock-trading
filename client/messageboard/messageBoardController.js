var app = angular.module('app')

app.controller('MessageBoardController', function($scope, messageBoardFactory, $rootScope, $window, $stateParams){

  $scope.posts;

  $scope.userPost = {};
  $scope.userPost.name = $window.localStorage.getItem('com.tp.username');
  $scope.userPost.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.userPost.leagueId = $stateParams.leagueId;

  $scope.messageBoardPost = function(){
    console.log('userPost')
    console.log($scope.userPost);
    messageBoardFactory.submitPost($scope.userPost);
    messageBoardFactory.showPosts().then(function(posts){
      var posts = posts;
      $scope.posts = posts.data;
      console.log(posts);
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