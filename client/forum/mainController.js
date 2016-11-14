var app = angular.module('app');

app.controller('MainForumController', ['$scope', '$window', 'forumFactory', '$rootScope', '$location', '$anchorScroll','topicFactory', function($scope, $window, forumFactory, $rootScope, $location, $anchorScroll, topicFactory){

  // these filters are to show the newest topics first
  $scope.sortLatest = 'createdAt';
  $scope.sortReverse = true;

  $scope.topic = {};

  $scope.topic.username = $window.localStorage.getItem('com.tp.username');
  $scope.topic.userId = $window.localStorage.getItem('com.tp.userId');

  $scope.allTopics;

  //modal when create new forum
  $scope.openModal = function(){
    $('#createForumPost').openModal();
  };

  //add new topic
  $scope.createTopic = function(topic){
    forumFactory.addNewTopic(topic).then(function(err, res){
      if (err) {
        console.log(err);
        return;
      }
    }).then(function(){
      $scope.topic.title = '';
      $scope.topic.description = '';
      $('#createForumPost').closeModal();
      $scope.showAllTopics();
      $scope.goToTop();
    });
  };

  //retrieve all topics in forum
  $scope.showAllTopics = function(){
    forumFactory.showAllTopics().then(function(data){
      $scope.allTopics = data.data;

      for(var i = 0; i < $scope.allTopics.length; i++){
        // an IIFE is required here bc of async issues
        (function(index){
          $scope.allTopics[index].replies = 0;
          topicFactory.showAllReplies($scope.allTopics[index].id)
            .then(function(replies){
              // console.log('#ofREPLIES: ', replies);
              $scope.allTopics[index].replies = replies.data.length;

            });
        })(i);
      }

    });
  };

  $scope.oneTopic = function(){
    if($scope.allTopics.length > 0){
      return true;
    }
  };

  //automatically go to top of the page
  $scope.goToTop = function(){
    $location.hash('top');
    $anchorScroll();
  };

  $scope.showAllTopics();

}]);
