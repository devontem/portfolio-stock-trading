var app = angular.module('app');

app.factory('topicFactory', ['$http', function($http){

  var addNewReply = function(userReply){
    console.log('$$$$$$$$', userReply)
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
  var showAllReplies = function(){
    return $http({
      method: 'GET',
      url: '/api/topics/'
      // url: '/api/topic/'+topicId
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