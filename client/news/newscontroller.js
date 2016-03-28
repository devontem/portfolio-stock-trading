app.controller('NewsController', ['$scope', '$window', '$stateParams', 'News', function($scope, $window, $stateParams, News){


  $scope.tweets = [];

  $scope.getTweets= function(){

    var leagueId = $stateParams.leagueId;
    var userId = $window.localStorage.getItem('com.tp.userId');
    $scope.tweets = [];
    News.getNews(userId, leagueId)
    .then(function (res){
      res.data.forEach(function(tweet){
        $scope.tweets.push({text: tweet.text, user: tweet.user, time: tweet.created_at});
      });

    });
  };

  //$scope.getTweets();
}]);
