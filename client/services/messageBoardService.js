var app = angular.module('app');

app.directive('scrollDirective', function ($rootScope) {
  return {
    scope: {
      scrollDirective: '='
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollDirective', function (newValue) {
        if (newValue) {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });

      $rootScope.$on('scrollDown', function() {
        setTimeout(function() {
          $(element).scrollTop($(element)[0].scrollHeight);
        }, 0);
      });
    }
  }
})


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
