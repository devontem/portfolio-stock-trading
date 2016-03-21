app.factory('News', ['$http', function($http) {
  var getNews = function(userId, leagueId) {
    return $http({
      method: 'Get',
      url: '/api/tweets/'+leagueId+'/'+userId
    });
  };
  return {
    getNews: getNews
  };
}]);
