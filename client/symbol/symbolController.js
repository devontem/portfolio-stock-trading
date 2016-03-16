app.controller('SymbolController', function($scope, $http, symbolFactory){

  $scope.stockName;

  $scope.result;

  $scope.getStock = function(stock){
   var symbol;
    symbolFactory.getCompany(stock).then(function(data){
      var sym = data.data.ResultSet.Result[0];
      console.log(sym,'$$$$$$$')
      for(var i=0;i<sym.symbol.length;i++){
        if(sym.symbol[i] === '.'){
          symbol = sym.symbol.split('.');
          sym ={'symbol' : symbol[0], 'name': sym.name}
          
        }
      }
      
      $scope.result = sym;
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
