app.controller('NewsController', function($scope, News){


  $scope.tweets = [];
  $scope.tweets.length = 5;

  $scope.getTweets= function(){

  	News.getNews()
  	.then(function (res){

      for(var i = 0; i < $scope.tweets.length; i++){
        $scope.tweets[i] = res.data[i];
        console.log($scope.tweets[i])
      }
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



