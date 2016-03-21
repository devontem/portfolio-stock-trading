var app = angular.module('app');

app.controller('TopicController', ['$scope', 'topicFactory', '$stateParams', '$window', 'forumFactory', '$location', '$anchorScroll', function($scope, topicFactory, $stateParams, $window, forumFactory, $location, $anchorScroll){

  // functionality to show and hide reply form field
  $scope.replyClicked = false;

  $scope.reply = function(){
    $scope.replyClicked = true;
  };

  $scope.cancelReply = function(){
    $scope.replyClicked = false;
  };

  // functionality to generate a reply and post

  $scope.allReplies;
  $scope.topicReply = {};
  $scope.topicReply.topicId = $stateParams.topicId;
  $scope.topicReply.userName = $window.localStorage.getItem('com.tp.username');
  $scope.topicReply.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.topicReply.message = '';

  $scope.topicInfo;

  $scope.submitReply = function(reply){
    topicFactory.addNewReply(reply).then(function(err, res){
      if(err){console.log(err)}
    })
    .then(function(){
      $scope.topicReply.message = '';
      $scope.cancelReply();
      $scope.getAllReplies();
    });
  };

  $scope.getAllReplies = function(){
    topicFactory.showAllReplies($scope.topicReply.topicId).then(function(data){
      $scope.allReplies = data.data;
    });
  };

  $scope.getOneTopic = function(){
    forumFactory.getOneTopic($scope.topicReply.topicId).then(function(data){
      $scope.topicInfo = data.data[0];
    });
  };

  $scope.momentJS = function(time){
    return moment(time).fromNow();
  };

  $scope.lastPost = function(){
    $location.hash('last');
  };

  $scope.toTop = function(){
    $location.hash('top');
  };

  $scope.getOneTopic();
  $scope.getAllReplies();
  $anchorScroll();

  $scope.hasPosts = function(){
    return $scope.allReplies.length > 3;
  }

}]);
