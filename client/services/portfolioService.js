app.factory('Portfolio', function($http){

  var buySell = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions',
      data: options
    }).then(function(data){
      return data;
    })
  }

  var getStock = function(stockName){
    return $http({
      method: 'GET',
      url: '/api/stocks/'+stockName
    }).then(function(stock){
      //console.log(stock.data.query.results.quote)
      return stock.data.query.results.quote;
    })
  }

  var getPortfolio = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/'+leagueId+'/'+userId
    }).then(function(portfolio){
      //console.log('User Account Info (incl. Balance)', portfolio.data);
      return portfolio.data;
    })
  }

  var getUserStocks = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    })
  }

  return {
    getStock: getStock,
    buySell: buySell,
    getPortfolio: getPortfolio,
    getUserStocks: getUserStocks
  }
})

