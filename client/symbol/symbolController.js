
app.controller('SymbolController', ['$scope', '$http', 'WatchlistFactory','symbolFactory', 'Portfolio', '$rootScope', '$window',function($scope, $http, WatchlistFactory, symbolFactory, Portfolio, $rootScope, $window){


  $scope.stockName;

  $scope.results=[];
  // function to find stock symbol by stock name
  $scope.getStock = function(stock){

   $scope.results=[];
   var filter =[];
   var symbol;
    symbolFactory.getCompany(stock).then(function(data){
      var sym = data.data.ResultSet.Result;
      for(var j=0;j<sym.length;j++){
         if(sym[j].exchDisp === 'NYSE' || sym[j].exchDisp === 'NASDAQ'){
           filter.push(sym[j]);
         }
      }
      if(!filter.length){
        Materialize.toast('Company could not be found on NYSE or NASDAQ! Check for spaces and punctuation', 5000);
      }

      for(var i=0;i<filter.length;i++){
        $scope.results.push({'symbol' : filter[i].symbol, 'name': filter[i].name});
        }
      $scope.stockName = '';
    });

  };
  //once symbol retrieved, this function can add it directly to watchlist
  $scope.addToWatchlist = function (symbol){
    $scope.userId = $window.localStorage.getItem('com.tp.userId');

    Materialize.toast('Watchlist Updated', 3000);
    WatchlistFactory.getWatchlist($scope.userId)

    .then(function (list){
      return;
    });


    var data = {

      userid : $scope.userId,
      symbol : symbol
    };

  symbolFactory.addToWatchlist(data)
    .then();
  };
  // MODAL FUNCTIONALITY OPEN AND CLOSE
  $scope.openModal = function(){
    $('#modal1').openModal();
  };

  $scope.closeModal = function(){
    $('#modal1').closeModal();
  };
  // functionality to populate buy/sell symbol field with symbol
  $scope.populate = function(symbol){
    $rootScope.$emit('symbolRetrieved', symbol);
    $scope.closeModal();
  };


}]);
