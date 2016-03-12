app.controller('NewsController', function($scope, News){

  
  $scope.tweets = [];

  $scope.getTweets= function(){
  	console.log('hi')
  	News.getNews()
  	.then(function (res){
  		res.data.forEach(function(tweet){
  			
  			$scope.tweets.push({text:tweet.text, user : tweet.user, time: tweet.created_at})
  			console.log($scope.tweets,'data')
  		})
  	})
  }
})


.factory('News', function($http) {
	var getNews = function(cb) {
		console.log('bye')
		return $http({
			method: 'Get',
			url: '/api/tweets'
		})
	}
	return {
		getNews: getNews
	}
})



