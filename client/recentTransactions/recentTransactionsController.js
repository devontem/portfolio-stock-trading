var app = angular.module('app')

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})

.filter('negative', function () {
   return function (items) {
    if(items <1){
      return Math.abs(items);
    }
    else{
      return Math.abs(items);
    }
  };
})

.controller('recentTransactionsController', ['$scope', 'transactionFactory', '$stateParams', 'leaderBoardFactory', function ($scope, transactionFactory, $stateParams, leaderBoardFactory) {

  var leagueId = $stateParams.leagueId;

  $scope.portfolios =[];
  $scope.transactions = [];
  $scope.usernames = {};

  $scope.getleagueTransactions = function (arr) {
    	  $scope.transactions =[];
        transactionFactory.getleagueTransactions(arr)
        .then(function (transactions){

        		angular.forEach(transactions.data, function (transaction){

        			for(var k in $scope.usernames){
        				if(parseInt(k) === transaction.portfolioid){
        					transaction.portfolioid = $scope.usernames[k];
        				}
        			}
        			$scope.transactions.push(transaction);
        		});
        });
  };
  $scope.getPortfolios = function () {
  	leaderBoardFactory.getPortfolios(leagueId)
  	  .then(function (portfolios) {
  	  	portfolios.forEach(function (portfolio) {
  	  		var id = portfolio.id;
  	  		$scope.usernames[portfolio.id]= portfolio.username;
  	  		$scope.portfolios.push({'PortfolioId': portfolio.id});
  	  	});
        $scope.getleagueTransactions($scope.portfolios);
  	  });
  };

  $scope.getPortfolios();

}]);
