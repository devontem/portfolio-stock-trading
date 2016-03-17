app.controller('SymbolController', function($scope, $http, symbolFactory, Portfolio, $rootScope){

  $scope.stockName;

  $scope.results=[]
  $scope.getStock = function(stock){
   $scope.results=[];
   var filter =[];
   var symbol;
    symbolFactory.getCompany(stock).then(function(data){
      var sym = data.data.ResultSet.Result;
      for(var j=0;j<sym.length;j++){
         if(sym[j].exchDisp === 'NYSE' || sym[j].exchDisp === 'NASDAQ'){
           filter.push(sym[j])
         }
      }
      if(!filter.length){
        Materialize.toast('Company could not be found on NYSE or NASDAQ! Check for spaces and punctuation', 5000)
      }

      for(var i=0;i<filter.length;i++){
        $scope.results.push({'symbol' : filter[i].symbol, 'name': filter[i].name})
        }
      console.log($scope.results,'$$$$$')
      $scope.stockName = '';
    })

  }

  $scope.openModal = function(){
    $('#modal1').openModal();
  }

  $scope.closeModal = function(){
    $('#modal1').closeModal();
  }


  $scope.populate = function(symbol){
    console.log('STOCK SYMBOL: ', symbol)
    $rootScope.$emit('symbolRetrieved', symbol);
    $scope.closeModal();
  }

})
