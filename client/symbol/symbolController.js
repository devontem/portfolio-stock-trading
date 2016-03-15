app.controller('SymbolController', function($scope, $http){

  $scope.stockName;

  $scope.result;

  $scope.getStock = function(stock){

    console.log('clicked')

    $http.get("http://d.yimg.com/aq/autoc?query="+stock+"&region=US&lang=en-US")
    .then(function(response){
      $scope.result = response.data;
    });

  }

    //"http://d.yimg.com/aq/autoc?query=chipotle&region=US&lang=en-US"

})
