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

  var limitOrder = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions/limitorder',
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
      return stock;
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

  var updateUserStocks = function(leagueId, userId){
    return $http({
      method: 'PUT',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    });
  }

  return {
    getStock: getStock,
    buySell: buySell,
    getPortfolio: getPortfolio,
    getUserStocks: getUserStocks,
    updateUserStocks: updateUserStocks,
    limitOrder: limitOrder
  }
})

