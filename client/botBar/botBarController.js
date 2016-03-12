angular.module('app.botbar', [])

// TODO: likely change portofolio factory name to be more precise
.controller('BotBarController', function($scope, Portfolio){
  var chooseStock = function () {
    console.log('clicked');
    var stockName = $scope.stockInput;
    Portfolio.getStock(stockName).then(function(stock){
      console.log(stock);
      $scope.stock = stock;
      $scope.estPrice = stock.Ask;
    });
    $scope.stockInput = "";
  };
});
