var app = angular.module('app')
app.controller('tickerController', ['$scope', '$http', 'Ticker','symbolFactory', 'WatchlistFactory',  '$rootScope', '$location','$window', '$timeout', '$interval', function($scope, $http, Ticker, symbolFactory, WatchlistFactory,  $rootScope, $location,$window, $timeout, $interval){

$scope.stocks=[];
$scope.allstocks=[];
$scope.finalstocks=[];

//chage color base on positive or negative price change
$scope.isPositive = function (val){
  if (!val) {
    return;
  }
  val = val.slice(0,-1);
  var result = parseFloat(val);
  if(result > 0) {
    return 'positive';
    }
    else {
      return 'negative';
    }  

}



  $scope.boxes = [];

  $scope.ticker = true;
  $rootScope.$on('search', function(){
    $scope.ticker = false;

    setTimeout(function(){
      $scope.ticker=true;
      $rootScope.$emit('off')
    }, 15000)
  });



$scope.getAllPortfolioId = function (){
  
  $scope.stocks=[];
  $scope.finalstocks=[];
  $scope.temp = [];

  var userId = $window.localStorage.getItem('com.tp.userId');

  WatchlistFactory.getWatchlist(userId)

  	.then(function (list){
      for(var stock in list.data){
        $scope.stocks.push(stock);
    }
      })

  //get all stock of a user (include both watch list and every portfolio)
  Ticker.getAllPortfolioId(userId)
  .then(function (portfolios){
     $scope.portfolios = portfolios.data;
     Ticker.getAllUserStocks($scope.portfolios)
     .then(function (stocks){

     	$scope.temp = $scope.temp.concat(stocks.data);
      $scope.temp.forEach(function(stock){
        $scope.stocks.push(stock.toUpperCase())
      })

     	Ticker.stocksQuery($scope.stocks)
     	.then(function (stockinfo){

     		stockinfo.data.pop()
           stockinfo.data.forEach(function(stock){

          stock.forEach(function(result){
          var result1 = result.replace(/\"/g,'');
          if(/[\%]/.test(result1)){
              
              var res = result1.replace(/\%/,'')
              var sign = res[0];
              var decimal = res.substr(1)
              var ans = parseFloat(decimal).toFixed(2)
              var final = sign + ans.toString()
              result1=final.concat('%')
          }
          $scope.allstocks.push(result1)
     	})
          $scope.finalstocks.push($scope.allstocks)
          $scope.allstocks=[];
     })
           $scope.boxes = [];
           for(var i=0; i<$scope.finalstocks.length; i++){
             $scope.boxes.push($scope.finalstocks[i]);
           }

            //animation for ticker to move
           $scope.moving = false;
           $scope.moveLeft = function() {
             $scope.moving = true;
             $interval(function() {
               if ($scope.moving) {
                 $scope.boxes.push($scope.boxes.shift());
               }
               $scope.moving = !$scope.moving;
             }, 2000);

           };
           $scope.moveLeft();
       })
  })
 })
}

$scope.getAllPortfolioId()

}])


.factory('Ticker', function ($http) {

	var  getAllPortfolioId = function(userID){
		//console.log(userID,'id');

      return $http({
        method: 'post',
        url: '/api/ticker/',
        data: {id: userID}
        
      })
      .then(function(data){
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