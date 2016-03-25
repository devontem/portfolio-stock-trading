app.factory('WatchlistFactory', function ($http){

    var getWatchlist = function(userid){
    return $http({
      method: 'GET',
      url: '/api/watchlist/' + userid,
    })
    .then( function (data) {
      return data;
    });
  }

    var updateWatchlist = function(array){
      return $http({
        method: 'Post',
        url:'/api/watchlist/array',
        data: array
      })
    }

    var removeFromWatchlist = function (data){
       return $http({
        method:'Post',
        url: '/api/watchlist/remove',
        data: data
       })
    }

  return {
    getWatchlist:getWatchlist,
    updateWatchlist:updateWatchlist,
    removeFromWatchlist:removeFromWatchlist

  }

})