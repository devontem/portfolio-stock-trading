var app = angular.module('app');

app.factory('topicFactory', ['$http', function($http){

  var addNewReply = function(topic){
    return $http({
      method: 'POST',
      url: '/api/topic',
      data: topic
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  var showAllReplies = function(){
    return $http({
      method: 'GET',
      url: '/api/topic',
    })
    .then(function(replies){
      return replies;
    });
  }



  return {
    addNewReply: addNewReply,
    showAllReplies: showAllReplies
  };

}])