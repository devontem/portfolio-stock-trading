angular.module('app.botbar', [])

// TODO: likely change portofolio factory name to be more precise

.controller('BotBarController',['$scope', 'Portfolio','symbolFactory','WatchlistFactory','BotbarFactory', '$window', '$interval','$rootScope', function($scope, Portfolio, symbolFactory, WatchlistFactory, BotbarFactory, $window,$interval,$rootScope ){

  // Initializes variable if the user has not searched yet
  $scope.hasSearched = false;

  //on click "search" for stock quote
  $scope.stockSearch = function () {
    var stockName = $scope.stockInput.toUpperCase();
    BotbarFactory.searchStock(stockName).then(function(stock){
      if(!stock.Ask){
        Materialize.toast('Please enter valid symbol!', 3000);
      }
      else{
        $scope.stock = stock;
        $scope.hasSearched = true;
    }
    });

    $rootScope.$emit('search');

    $scope.stockInput = "";
  };
  
  //on click add to watch list from search bar
  $scope.addToWatchlist = function (symbol){
    $scope.userId = $window.localStorage.getItem('com.tp.userId');
    
    Materialize.toast('Watchlist Updated', 3000);
    WatchlistFactory.getWatchlist($scope.userId)
    .then(function (list){
      console.log(list,'list')
    })
    var data = {
      userid : $scope.userId,
      symbol : symbol
    }
  symbolFactory.addToWatchlist(data)
  .then(function(){
    $rootScope.$emit('addedToWatchlist')
  })
}
  
  


  
}]);
