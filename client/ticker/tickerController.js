

var app = angular.module('app')
app.controller('tickerController', ['$scope', '$http', 'Ticker','symbolFactory', 'WatchlistFactory',  '$rootScope', '$location','$window', function($scope, $http, Ticker, symbolFactory, WatchlistFactory,  $rootScope, $location,$window){

$scope.stocks=[];
$scope.allstocks=[];
$scope.finalstocks=[];

function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }

$scope.getAllPortfolioId = function (){
  //button
  $scope.stocks=[];
  $scope.finalstocks=[];

  var userId = $window.localStorage.getItem('com.tp.userId');

  WatchlistFactory.getWatchlist(userId)

  	.then(function (list){
      for(var stock in list.data){
        $scope.stocks.push(stock);
    }
      })


  Ticker.getAllPortfolioId(userId)
  .then(function (portfolios){
     $scope.portfolios = portfolios.data;
     Ticker.getAllUserStocks($scope.portfolios)
     .then(function (stocks){
     	$scope.stocks = $scope.stocks.concat(stocks.data);
     	console.log($scope.stocks,'stocks')

     	Ticker.stocksQuery($scope.stocks)
     	.then(function (stockinfo){
     		//console.log(stockinfo.data,'$$$$')

     		stockinfo.data.pop()
           stockinfo.data.forEach(function(stock){

          stock.forEach(function(result){
          var result1 = result.replace(/\"/g,'');
          if(/[\%]/.test(result1)){
            result1 = result1.split('.')
            var res = result1[1].replace(/\%/,'')
            result1[1]= res
            var decimal = Math.round10(result1[1]);
            if(decimal <10){
              decimal = decimal * 10
            }
            var str =''
            result1[1]=str.concat(decimal +'%')
            result1 = result1.join('.')
          }
          $scope.allstocks.push(result1)
     	})
          $scope.finalstocks.push($scope.allstocks)
          $scope.allstocks=[];
          

     })
           console.log($scope.finalstocks,'yooo')
       })
     

  })
 })



  

}






}])


.factory('Ticker', function ($http) {

	var  getAllPortfolioId = function(userID){
		console.log(userID,'id');

      return $http({
        method: 'post',
        url: '/api/ticker/',
        data: {id: userID}
        
      })
      .then(function(data){
      	console.log('donnnnee')
      	return data;
      })
      
  }

  var getAllUserStocks = function(data) {
  	return $http({
  		method: 'Post',
  		url: '/api/ticker/stocks',
  		data: {ids: data}
  	})
  }
   
  var stocksQuery = function (data) {
  	return $http({
  		method: 'Post',
  		url: '/api/ticker/stockquote',
  		data: {stocks: data}
  	})
  }



  return {
  	getAllUserStocks:getAllUserStocks,
  	getAllPortfolioId:getAllPortfolioId,
  	stocksQuery:stocksQuery
  }
})