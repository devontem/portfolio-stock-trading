var app = angular.module('app')

app.controller('TopicController', ['$scope', 'topicFactory', '$stateParams', '$window', function($scope, topicFactory, $stateParams, $window){

  // functionality to show and hide reply form field
  $scope.replyClicked = false;

  $scope.reply = function(){
    $scope.replyClicked = true;
  }

  $scope.cancelReply = function(){
    $scope.replyClicked = false;
  }

  // functionality to generate a reply and post
  //
  $scope.allReplies;
  $scope.topicReply = {};
  $scope.topicReply.topicId = 100; /*$stateParams.topicId;*/
  $scope.topicReply.userName = $window.localStorage.getItem('com.tp.username');
  $scope.topicReply.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.topicReply.message = '';

  $scope.submitReply = function(reply){
    topicFactory.addNewReply(reply).then(function(err, res){
      if(err){console.log(err)}
    })
    .then(function(){
      //add function here to show all replies
      $scope.topicReply.message = '';
      $scope.cancelReply();
      $scope.getAllReplies();
    })
  }

  $scope.getAllReplies = function(){
    topicFactory.showAllReplies().then(function(data){
      $scope.allReplies = data.data;
    })
  }

  $scope.getAllReplies();

}])