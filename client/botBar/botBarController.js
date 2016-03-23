angular.module('app.botbar', [])

// TODO: likely change portofolio factory name to be more precise

.controller('BotBarController',['$scope', 'Portfolio','WatchlistFactory','symbolFactory', '$window', '$interval', function($scope, Portfolio, WatchlistFactory, symbolFactory, $window,$interval ){

  // Initializes variable if the user has not searched yet
  $scope.hasSearched = false;

  $scope.stockSearch = function () {
    var stockName = $scope.stockInput.toUpperCase();
    Portfolio.getStock(stockName).then(function(stock){
      if(!stock.Ask){
        Materialize.toast('Please enter valid symbol!', 3000);
      }
      else{
        $scope.stock = stock;
        $scope.hasSearched = true;
    }
    });
    $scope.stockInput = "";
  };
  
  $scope.addToWatchlist = function (symbol){
    console.log(symbol,'sym')
    $scope.userId = $window.localStorage.getItem('com.tp.userId');

    Materialize.toast('Watchlist Updated', 3000);

    var data = {
    
      userid : $scope.userId,
      symbol : symbol
    }
  console.log(data,'data')
  symbolFactory.addToWatchlist(data)
  .then()
  }



}]);
