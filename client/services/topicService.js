var app = angular.module('app');

app.factory('topicFactory', ['$http', function($http){

  var addNewReply = function(userReply){
    return $http({
      method: 'POST',
      url: '/api/topics',
      data: userReply
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  // add topicId back as an argument
  var showAllReplies = function(topicId){
    return $http({
      method: 'GET',
      url: '/api/topics/'+topicId
    })
    .then(function(replies){
      return replies;
    });
  }

  var deleteReply = function(replyId){
    return $http({
      method: 'DELETE',
      url: 'api/topics',
      data: {id: replyId},
      headers: {"Content-Type": "application/json;charset=utf-8"}
    })
    .then(function(reply){
      console.log(reply + ', this was deleted');
    })
  }



  return {
    addNewReply: addNewReply,
    showAllReplies: showAllReplies,
    deleteReply: deleteReply
  };

}])