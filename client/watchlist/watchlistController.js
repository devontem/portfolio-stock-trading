
var app = angular.module('app')
app.controller('WatchlistController', function($scope, $http, symbolFactory, WatchlistFactory,  $rootScope, $location,$window){

  $scope.watchlist = [];
  $scope.results =[];
  $scope.stock=[];


var userid = $window.localStorage.getItem('com.tp.userId');



$scope.getWatchlist = function (){
    $scope.watchlist =[];
    $scope.results=[];
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


  	WatchlistFactory.getWatchlist(userid)

  	.then(function (list){


    // console.log($scope.results,'res1')
      for(var stock in list.data){
        $scope.watchlist.push(stock);
      }
    WatchlistFactory.updateWatchlist($scope.watchlist)
    .then(function (stocks){

      stocks.data.pop()
      console.log(stocks.data,'stocks')
      stocks.data.forEach(function(stock){

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
          else if(/[\-]/.test(result1)){
            var range = [];
            result1 = result1.split('-')
            result1.forEach(function(num){
              result1 = parseFloat(num).toFixed(2)
              range.push(result1)
            })
            result1 = range.join('-')
          }
          console.log(result1,'res1')
          $scope.stock.push(result1)
        })

          $scope.results.push($scope.stock)
          console.log($scope.results,'stock')
        $scope.stock=[];
      })
    })
  })
  }

  $scope.removeFromWatchlist = function (symbol){

    var userid = $window.localStorage.getItem('com.tp.userId');

    var data = {
      symbol: symbol,
      userid: userid
    }
    console.log(data,'data')
    WatchlistFactory.removeFromWatchlist(data)
    .then(function(yo){
      Materialize.toast('Removed from Watchlist', 3000)
      $scope.getWatchlist();
    })
  }



  $scope.delay = function(symbol, delay1){
    console.log('hello buddy', symbol)
    $scope.delay1(symbol);

  }

  $scope.delay1 = function (symbol){

    console.log('hello buddies', symbol)
    $rootScope.$emit('symbolAnalysis', symbol)
  }

   


  $scope.sendToChart = function (symbol){
    console.log(symbol,'sym')
    $window.sym = symbol;
        
    $location.path('/analysis')
    

  }
    
  


   

  $scope.sendToChart = function (symbol){
    console.log(symbol,'sym')
    $window.sym = symbol;
        
    $location.path('/analysis')
    
  }
    
  

  $rootScope.$on('addedToWatchlist', function(){

    $scope.getWatchlist();
  });

  $scope.getWatchlist();

})

.factory('WatchlistFactory', function ($http){

    var getWatchlist = function(userid){
    return $http({
      method: 'GET',
      url: '/api/watchlist/' + userid,
    })
    .then( function (data) {
      return data;
    });
  }

    var updateWatchlist = function(array){
      return $http({
        method: 'Post',
        url:'/api/watchlist/array',
        data: array
      })
    }

    var removeFromWatchlist = function (data){
       return $http({
        method:'Post',
        url: '/api/watchlist/remove',
        data: data
       })
    }

  return {
    getWatchlist:getWatchlist,
    updateWatchlist:updateWatchlist,
    removeFromWatchlist:removeFromWatchlist

  }

})



