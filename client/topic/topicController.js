var app = angular.module('app')

app.controller('TopicController', ['$scope', 'topicFactory', '$stateParams', function($scope, topicFactory, $stateParams){

  // functionality to show and hide reply form field
  $scope.replyClicked = false;

  $scope.reply = function(){
    $scope.replyClicked = true;
  }

  $scope.cancelReply = function(){
    $scope.replyClicked = false;
  }

  // functionality to generate a reply and post
  $scope.reply = {};
  $scope.reply.topicId = $stateParams.topicId;
  $scope.reply.username = $window.localStorage.getItem('com.tp.username');
  $scope.reply.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.reply.message = '';

  $scope.submitReply = function(reply){
    topicFactory.addNewReply(reply).then(function(err, res){
      if(err){console.log(err)}
    })
    .then(function(){
      //add function here to show all replies
      $scope.topicReply = '';
      $scope.cancelReply();
    })
  }


}])