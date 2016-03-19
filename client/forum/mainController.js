var app = angular.module('app')

app.controller('MainForumController', ['$scope', '$window', 'forumFactory', '$rootScope', '$location', '$anchorScroll', function($scope, $window, forumFactory, $rootScope, $location, $anchorScroll){

  $scope.sortLatest = 'createdAt';
  $scope.sortReverse = true;
  $scope.topic = {};
  $scope.topic.username = $window.localStorage.getItem('com.tp.username');
  $scope.topic.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.topicId;
  $scope.allTopics;

  $scope.openModal = function(){
    $('#createForumPost').openModal();
  }

  $scope.createTopic = function(topic){
    forumFactory.addNewTopic(topic).then(function(err, res){
      if(err){console.log(err)}
    }).then(function(){
      $scope.topic.title = '';
      $scope.topic.description = '';
      $('#createForumPost').closeModal();
      $scope.showAllTopics();
      $scope.goToTop();
    })
  }

  $scope.showAllTopics = function(){
    forumFactory.showAllTopics().then(function(data){
      $scope.allTopics = data.data;
    })
  }

  $scope.goToTop = function(){
    $location.hash('top');
    $anchorScroll();
  }

  $scope.showAllTopics();

}])