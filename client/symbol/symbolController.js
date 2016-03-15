app.controller('SymbolController', function($scope, $http){

  $scope.stockName;

  $scope.query = [];

  $scope.getStock = function(){

    console.log('clicked')

    var query = "http://d.yimg.com/aq/autoc?query="+$scope.stockName+"&region=US&lang=en-US&callback=YAHOO.util.ScriptNodeDataSource.callbacks"

    console.log(query);

  }

})
