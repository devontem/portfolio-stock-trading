angular.module('app.botbar', [])

// TODO: likely change portofolio factory name to be more precise
.controller('BotBarController',['$scope', 'Portfolio', function($scope, Portfolio){
  // Initializes variable if the user has not searched yet
  $scope.hasSearched = false;

  $scope.stockSearch = function () {
    var stockName = $scope.stockInput;
    Portfolio.getStock(stockName).then(function(stock){
      console.log(stock, '$$')
      $scope.stock = stock;
      $scope.hasSearched = true;
    });
    $scope.stockInput = "";
  };

}]);
