var goog = {qty: 5, symbol: 'GOOG', name: 'Google Inc.', price: 4.50, amt: '0.45%', marketval: 4.25, marketprice: 4.25, lifetime: 100, pl: 5}
var apple = {qty: 5, symbol: 'APPL', name: 'Apple Inc.', price: 4.50, amt: '0.45%', marketval: 4.25, marketprice: 4.25, lifetime: 100, pl: 5}
var mystocks = [goog, apple];

angular.module('app.portfolio', [])

.controller('PortfolioController', function($scope, $window, $stateParams, Portfolio){
	// MAKE A TRADE MODAL
	$scope.fees = 10;
	$scope.estPrice = 0;
	$scope.action = false

	$scope.chooseStock = function(){
		var stockName = $scope.stockInput;
		Portfolio.getStock(stockName).then(function(stock){
			$scope.stock = stock;
			$scope.estPrice = stock.Ask;
		});
		resetFields();
	}

	// Either buys a stock or sells it depending on selection
	$scope.performAction = function(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');
		var options = {
			symbol: $scope.stock.symbol,
			company: $scope.stock.Name,
			leagueId: leagueId,
			userId:  userId,
			shares: $scope.stockAmount,
			price: $scope.stock.Ask,
			marketPrice: $scope.stock.Ask,
			buysell: !$scope.action
		}

		// if selling stock, must own it and enough shares
		if (!options.buysell && !ableToSell()){
			return false;
		} 
		// ig buying a stock, must have enough money
		if (options.buysell && $scope.estPrice > $scope.balance){
			Materialize.toast("Your balance isn't high enough to make this trade", 3000, 'rounded');
			return false;
		}
		
		Portfolio.buySell(options).then(function(data){
			console.log('Transaction posted: ', data);
			Materialize.toast('You traded '+options.shares+' shares in '+options.company, 3000, 'rounded');
			resetFields();
		});
	}

	function ableToSell(){
		for (var i = 0; i < $scope.stocks.length; i++){
			if ($scope.stocks[i].symbol === $scope.stock.symbol){
				console.log('they match')
				if ($scope.stockAmount <= $scope.stocks[i].shares){
					return true;
				} else {
					Materialize.toast('You are selling more shares in this company than you own', 3000, 'rounded');
					return false;
				}
			}
		};
		Materialize.toast('You do not own this share to sell', 3000, 'rounded');
		return false;
	}

	// function buy(){
	// 	// getting it from the routing params '/leagues/:id'
	// 	var leagueId = $stateParams.leagueId;
	// 	var userId = $window.localStorage.getItem('com.tp.userId');
	// 	var options = {
	// 		symbol: $scope.stock.symbol,
	// 		buysell: true,
	// 		leagueId: leagueId,
	// 		userId:  userId,
	// 		shares: $scope.stockAmount,
	// 		price: $scope.stock.Ask
	// 	}
	// 	console.log('temp', options)
	// 	Portfolio.buySell(options).then(function(data){
	// 		console.log('Transaction posted: ', data);
	// 		resetFields();
	// 	});
	// }

	// function sell(){
	// 	var leagueId = $stateParams.leagueId;
	// 	var userId = $window.localStorage.getItem('com.tp.userId');
	// 	var options = {
	// 		symbol: $scope.stock.symbol,
	// 		company: $scope.stock.Name,
	// 		buysell: false,
	// 		leagueId: leagueId,
	// 		userId:  userId,
	// 		shares: $scope.stockAmount,
	// 		price: $scope.stock.Ask,
	// 	}

	// 	console.log('temp', options)
	// 	Portfolio.buySell(options).then(function(data){
	// 		console.log('Transaction posted: ', data);
	// 		resetFields();
	// 	});
	// }

	function resetFields(){
		$scope.stock = undefined;;
		$scope.stockAmount = '';
		$scope.stockInput = '';
		updatePortfolio();
	}

	$scope.updateAmounts = function(){
		$scope.estPrice = $scope.stockAmount * $scope.stock.Ask;
		$scope.total = $scope.estPrice + $scope.fees;
	}


	// MY STOCKS MODAL
	updatePortfolio();

	function updatePortfolio(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');

		//updating user balance
		Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
		});

		//updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions
		});
	}
})

.factory('Portfolio', function($http){

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
    	console.log(stock.data.query.results.quote)
    	return stock.data.query.results.quote;
    })
  }

  var getPortfolio = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/'+leagueId+'/'+userId
    }).then(function(portfolio){
    	console.log('User Account Info (incl. Balance)', portfolio.data);
    	return portfolio.data;
    })
  }

  var getUserStocks = function(leagueId, userId){
  	return $http({
      method: 'GET',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
    	console.log('User stocks', transactions.data)
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

