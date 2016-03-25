app.controller('NewsController', ['$scope', '$window', '$stateParams', 'News', function($scope, $window, $stateParams, News){


  $scope.tweets = [];

  $scope.getTweets= function(){

    var leagueId = $stateParams.leagueId;
    var userId = $window.localStorage.getItem('com.tp.userId');
    $scope.tweets = [];
    News.getNews(userId, leagueId)
    .then(function (res){
      res.data.forEach(function(tweet){
        console.log('TWEET: ', tweet)
        $scope.tweets.push({text: tweet.text, user: tweet.user, time: tweet.created_at});
      });

    });
  };

  $scope.tweetLink = function(tweet){
    var exp = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    return tweet.replace(exp, "<a href='$1' target='_blank'>$1</a>");
  }

  $scope.getTweets();
}]);
