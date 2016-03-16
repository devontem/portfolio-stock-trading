app.controller('NewsController', function($scope, $window, $stateParams, News){

  
  $scope.tweets = [];

  $scope.getTweets= function(){

  	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');
  	$scope.tweets = [];
  	News.getNews(userId, leagueId)
  	.then(function (res){
  		res.data.forEach(function(tweet){
  			$scope.tweets.push({text : tweet.text, user : tweet.user, time: tweet.created_at})
  		})
  		
  	})
  }
  $scope.getTweets();
})
.factory('News', function($http) {
	var getNews = function(userId, leagueId) {
		return $http({
			method: 'Get',
			url: '/api/tweets/'+leagueId+'/'+userId
		}).then(function(data){
      console.log('data', data)
    })
	}
	return {
		getNews: getNews
	}
})



