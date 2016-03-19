var app = angular.module('app');

var app = angular.module('app');

app.directive('scrollUpDirective', function ($rootScope) {
  return {
    scope: {
      scrollDirective: '='
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollUpDirective', function (newValue) {
        if (newValue) {
          $(element)[0].scrollTop = 0;
        }
      });

      $rootScope.$on('scrollUp', function() {
        setTimeout(function() {
          $(element)[0].scrollTop = 0;
        }, 0);
      });
    }
  }
})

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