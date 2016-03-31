var app = angular.module('app')

//reverse transactions so newest go first
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})

//absolute all negative to positive, for # shares bougth/sold
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

.controller('recentTransactionsController', ['$scope', 'transactionFactory', '$stateParams', 'leaderBoardFactory', '$rootScope', function ($scope, transactionFactory, $stateParams, leaderBoardFactory, $rootScope) {

  var leagueId = $stateParams.leagueId;

  $scope.portfolios =[];
  $scope.transactions = [];
  $scope.usernames = {};

  //fetch all transaction in league by leagueid
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

  //to receive latest transactions;
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

  $rootScope.$on('recentTrxn', function(){

    $scope.getPortfolios();
  });

  $scope.getPortfolios();

}]);
