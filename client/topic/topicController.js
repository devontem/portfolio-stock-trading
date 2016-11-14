var app = angular.module('app');

app.controller('TopicController', ['$scope', 'topicFactory', '$stateParams', '$window', 'forumFactory', '$location', '$anchorScroll', function($scope, topicFactory, $stateParams, $window, forumFactory, $location, $anchorScroll){

  $scope.reply = function(){
    $scope.replyClicked = true;
  };

  $scope.cancelReply = function(){
    $scope.topicReply.message = '';
  };

  // functionality to generate a reply and post
  $scope.allReplies;
  $scope.topicReply = {};
  $scope.topicReply.topicId = $stateParams.topicId;
  $scope.topicReply.userName = $window.localStorage.getItem('com.tp.username');
  $scope.topicReply.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.topicReply.message = '';

  $scope.topicInfo;

  $scope.hasReplies = false;

  $scope.submitReply = function(reply){
    topicFactory.addNewReply(reply).then(function(err, res){
      if (err){
        console.log(err);
        return;
      }
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
      if($scope.allReplies.length > 0){
        $scope.hasReplies = true;
      }
    });
  };

  $scope.getOneTopic = function(){
    forumFactory.getOneTopic($scope.topicReply.topicId).then(function(data){
      $scope.topicInfo = data.data[0];
    });
  };

  $scope.deleteReply = function(replyId){
    topicFactory.deleteReply(replyId).then(function(){
      $scope.getAllReplies();
    });
  };

  $scope.momentJS = function(time){
    return moment(time).fromNow();
  };

  $scope.scrollTo = function(div){
    $location.hash('loc-'+div);
  };

  $scope.getOneTopic();
  $scope.getAllReplies();
  $anchorScroll();


  $scope.usersPost = function(user){
    if(user === $window.localStorage.getItem('com.tp.userId')){
      return true;
    }
  };

}]);
