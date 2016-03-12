var app = angular.module('app');

app.factory('messageBoardFactory', function($http){

    var showPosts = function(posts){
        return $http({
          method: 'GET',
          url: '/api/messages',
          data: posts
        })
        .then(function(posts){
          return posts;
        });
    }

    var submitPost = function(post){
        return $http({
          method: 'POST',
          url: '/api/messages',
          data: post
        })
        .then(function(members){
          return members;
        });
    }

    return {
      showPosts: showPosts,
      submitPost: submitPost
    };
  })
