var app = angular.module('app');

app.controller('MessageBoardController', ['$scope', 'messageBoardFactory', '$rootScope', '$window', '$stateParams', function($scope, messageBoardFactory, $rootScope, $window, $stateParams){

  $scope.posts;

  $scope.userPost = {};
  $scope.userPost.name = $window.localStorage.getItem('com.tp.username');
  $scope.userPost.leagueId = $stateParams.leagueId;

  //Add new message to board
  $scope.messageBoardPost = function(){

    messageBoardFactory.submitPost($scope.userPost).then(function(){

      messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
        var posts = posts;
        $scope.posts = posts.data;
        console.log(posts);
        $scope.userPost.message = '';
        $rootScope.$emit('scrollDown');
      });

    });
  };

  $scope.leagueId;

  //retrieve all messages by leagueId
  var showPosts = function(){
    messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
    var posts = posts;
    $scope.posts = posts.data;
  });
};

  showPosts();
  // $window.setInterval(showPosts, 1000);

}]);
