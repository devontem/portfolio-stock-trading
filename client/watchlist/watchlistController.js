
var app = angular.module('app')
app.controller('WatchlistController', function($scope, $http, symbolFactory, WatchlistFactory, $rootScope, $window){
 
  $scope.watchlist = [];
  $scope.results =[];
  
  
var userid = $window.localStorage.getItem('com.tp.userId');

$scope.getWatchlist = function (){
 
 
 
  	WatchlistFactory.getWatchlist(userid)
  	.then(function (list){
      for(var stock in list.data){
        $scope.watchlist.push(stock);
      }
    WatchlistFactory.updateWatchlist($scope.watchlist)
    .then(function (stocks){
      stocks.data.pop()
      console.log(stocks.data,'stocks')
      $scope.results = stocks.data
    })
  })
  }

  // $scope.updateWatchlist = function (array){
  //   WatchlistFactory.updateWatchlist(array)
  //   .then()

  // }

  



})

.factory('WatchlistFactory', function ($http){
    
    var getWatchlist = function(userid){
      console.log(userid,'user')
    return $http({
      method: 'GET',
      url: '/api/watchlist/' + userid,
    })
    .then( function (data) {
      console.log(data)
      return data;
    });
  }

    var updateWatchlist = function(array){
      console.log(array,'array')
      return $http({
        method: 'Post',
        url:'/api/watchlist/array',
        data: array 
      })
    }

  return {
    getWatchlist:getWatchlist,
    updateWatchlist:updateWatchlist
  }

})