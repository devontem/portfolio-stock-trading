var app = angular.module('app');

app.factory('forumFactory', ['$http', function($http){

  var addNewTopic = function(topic){
    return $http({
      method: 'POST',
      url: '/api/forum',
      data: topic
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  var showAllTopics = function(){
    return $http({
      method: 'GET',
      url: '/api/forum',
    })
    .then(function(topics){
      return topics;
    });
  }



  return {
    addNewTopic: addNewTopic,
    showAllTopics: showAllTopics
  };


}])