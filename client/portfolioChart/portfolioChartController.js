


app.controller('PortfolioChartController', function($scope, Portfolio,$stateParams,$window){


$scope.data1 = {
		series: ['yo', 'yo1'],
		data: [{
			x: "Cash",
			y: [50],
			//tooltip: "this is tooltip"
		},
		{
			x:'Stocks',
			y:[50],
		}]
	};
	$scope.chartType = 'pie';

	$scope.config1 = {
		labels: true,
		click: function(d) {
			Materialize.toast('im alive', 3000)
		},
		title: "Asset Allocation",
		legend: {
			display: true,
			position: 'right'
		},
		innerRadius: 0
	};


$scope.getBalance = function (){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');
    Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
			$scope.total = $scope.balance + $scope.portfolioValue;
			console.log($scope.balance, $scope.portfolioValue,$scope.total,'balance')
			
		});
 
}
$scope.getBalance();


 
});