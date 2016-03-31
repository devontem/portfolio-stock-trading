angular.module('app.portfolio', [])

.controller('PortfolioController', ['$scope', '$window', '$stateParams', 'Portfolio', '$rootScope', function($scope, $window, $stateParams, Portfolio, $rootScope){
	// MAKE A TRADE MODAL
	$scope.leagueId = $stateParams.leagueId;
	$scope.userId = $window.localStorage.getItem('com.tp.userId');
	$scope.fees = 10;
	$scope.estPrice = 0;
	$scope.action = false;
	$scope.singlePrice = 0;
	$rootScope.$on('symbolRetrieved', function(event, data){
		return $scope.chooseStock(data);
	});

	$scope.ordtype = function(){

	};

	$scope.resetFields = function (){
		$scope.stock = undefined;
		$scope.stockAmount = '';
		$scope.stockInput = '';
		$scope.estPrice = '';
		$scope.singlePrice = '';
		$scope.total = '';
		$scope.action = false;
	};

	$scope.chooseStock = function(stockName){
		stockName = stockName.toLowerCase();
		Portfolio.getStock(stockName).then(function(stock){
			stock = stock.data;
			if(stock.Ask === 'N/A'){
				Materialize.toast('Please enter a valid symbol!',3000);
			}
			else {
			$scope.stock = stock;
			$scope.estPrice = stock.Ask;
			$scope.singlePrice = stock.Ask;
		}
		});
		$scope.resetFields();
	};

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
			buysell: !$scope.action,
			dayorder: !$scope.duration
		};
		// if selling stock, must own it and enough shares
		if (!options.buysell && !ableToSell()){
			return false;
		} else if (options.buysell && $scope.total > $scope.balance){
			Materialize.toast("Your balance isn't high enough to make this trade", 3000, 'rounded');
			return false;
		} else if (options.buysell && Number($scope.singlePrice) < Number($scope.stock.Ask)){
			options.price = $scope.singlePrice;
			options.executed = false;
			Portfolio.limitOrder(options).then(function(data){
			});
			Materialize.toast("Your limit order has been placed", 3000, 'rounded');
			$scope.resetFields();
			return false;
		} else {
			options.executed = true;
			Portfolio.limitOrder(options).then(function(data){
			});
			Portfolio.buySell(options).then(function(data){
				Materialize.toast('You traded '+options.shares+' shares in '+options.company, 3000, 'rounded');
				$scope.resetFields();

			}).then(function(){
				$rootScope.$emit('bought');
				$rootScope.$emit('recentTrxn');
				$scope.updateMarketPrice();
				updatePortfolio();
			});
		}
	};

	$rootScope.$on('update', function(){
		$scope.updateMarketPrice();
		updatePortfolio();
	});

	function ableToSell(){
		for (var i = 0; i < $scope.stocks.length; i++){
			if ($scope.stocks[i].symbol === $scope.stock.symbol){
				if ($scope.stockAmount <= $scope.stocks[i].shares){
					return true;
				} else {
					Materialize.toast('You are selling more shares in this company than you own', 3000, 'rounded');
					return false;
				}
			}
		}
		Materialize.toast('You do not own this share to sell', 3000, 'rounded');
		return false;
	}

	$scope.sellStock = function(stock){
    $scope.chooseStock(stock.symbol);
    $scope.action = true;

		//animation to scroll
		$('html, body').animate({
        scrollTop: $(".make-trades").offset().top
    }, 1500);
	};

	$scope.updateAmounts = function(){
		$scope.estPrice = $scope.stockAmount * $scope.singlePrice;
		$scope.total = $scope.estPrice + $scope.fees;
	};

	$scope.updateMarketPrice = function(){
			updatePortfolio();
			if ($scope.stocks.length > 0){
				Portfolio.updateUserStocks($scope.leagueId, $scope.userId).then(function(stocks){

				  if (stocks.error){
				  	Materialize.toast('Error updating market prices. Try again in a 30 seconds.', 5000, 'rounded');
				  } else {
				  	Materialize.toast('Market Price Updated', 3000, 'rounded');
				  	updatePortfolio();
				  }
				});
			}
		};

	// MY STOCKS MODAL
	// $scope.updateMarketPrice();

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
			$scope.stocks = transactions;

      transactions.forEach(function(transaction){
        transaction.percentage = (transaction.marketPrice*transaction.shares)/($scope.portfolioValue)*100;
      });

			$scope.stocks = transactions;
		});

    $rootScope.$emit("PortfolioUpdate", {});
	}

	$scope.twoDecimal = function(val){
			return val.toFixed(2);
		};

	updatePortfolio();

}]);
