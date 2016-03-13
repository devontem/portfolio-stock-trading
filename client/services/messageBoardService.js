var app = angular.module('app');
// to maintain scrollbar at bottom when new message is posted
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

// functions to show message board posts and submit them
app.factory('messageBoardFactory', function($http){

    var showPosts = function(id){
        console.log('ID *****', id)
        return $http({
          method: 'POST',
          url: '/api/messages/leagues',
          data: {id: id}
        })
        .then(function(posts){
          return posts;
        });
    };

    var submitPost = function(post){
        return $http({
          method: 'POST',
          url: '/api/messages',
          data: post
        })
        .then(function(members){
          return members;
        });
    };

    return {
      showPosts: showPosts,
      submitPost: submitPost,
    };
  })
