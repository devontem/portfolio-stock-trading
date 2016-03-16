app.controller('SymbolController', function($scope, $http, symbolFactory){

  $scope.stockName;

  $scope.result;

  $scope.getStock = function(stock){

    symbolFactory.getCompany(stock).then(function(data){
      $scope.result = data.data.ResultSet.Result[0];
      $scope.stockName = '';
    })

  }

  $scope.openModal = function(){
    $('#modal1').openModal();
  }

  $scope.closeModal = function(){
    $('#modal1').closeModal();
  }

})
