app.controller('SymbolController', function($scope, $http, symbolFactory){

  $scope.stockName;

  $scope.result;

  $scope.getStock = function(stock){

    symbolFactory.getCompany(stock).then(function(data){
      $scope.result = data.data.ResultSet.Result[0];
      $scope.stockName = '';
    })

  }

})
