app.controller('NewsController', function($scope, News){

  
  $scope.tweets = [];

  $scope.getTweets= function(){
  	$scope.tweets = [];
  	News.getNews()
  	.then(function (res){
  		res.data.forEach(function(tweet){
  			$scope.tweets.push({text : tweet.text, user : tweet.user, time: tweet.created_at})
  		})
  	})
  }
})
.factory('News', function($http) {
	var getNews = function() {
		return $http({
			method: 'Get',
			url: '/api/tweets'
		})
	}
	return {
		getNews: getNews
	}
})



