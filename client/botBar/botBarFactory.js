app.factory('BotbarFactory', function($http){

  var searchStock = function(stockName){
    return $http({
      method: 'GET',
      url: '/api/stocks/searchbar/'+stockName
    }).then(function(stock){
      return stock.data;
    })
  }

  return {
    searchStock: searchStock
  }
});