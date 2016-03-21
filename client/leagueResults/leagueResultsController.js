angular.module('app.leagueResults', [])

.controller('LeagueResultsController', function($scope, $stateParams, $window, leaderBoardFactory, DashboardFactory, Portfolio){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');

  // Getting the winner of the league
  leaderBoardFactory.getPortfolios(leagueId)
    .then(function(portfolios){
			var max = 0, winner;
			portfolios.forEach(function(portfolio){
				if (portfolio.balance + portfolio.portfolioValue > max){
					max = portfolio.balance + portfolio.portfolioValue;
					winner = portfolio;
				}
			});

			$scope.winner = winner;
   	});

  // Getting the current league
  DashboardFactory.getLeagueById(leagueId)
  	.then(function(league){
  		$scope.league = league;
  	});

  //Getting user stocks
  //updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions;

			var mostShares = 0 , mostStockShares;
			transactions.forEach(function(transaction){
				if (transaction.shares > mostShares){
					mostShares = transaction.shares;
					mostStockShares = transaction;
				}
			});
			$scope.mostShares = mostStockShares;
		});

});
