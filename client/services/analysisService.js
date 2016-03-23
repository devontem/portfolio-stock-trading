app.factory('AnalysisFactory', function($http){

  var getchart = function(stock){
    return $http({
      method: 'POST',
      url: '/api/analysis',
      data: stock
    })
    .then(function(data){
    });
  };

  var getinfo = function(stock){
    return $http({
      method: 'POST',
      url: '/api/analysis/getinfo',
      data: stock
    })
    .then(function(stock){
      return stock.data;
    });
  };

  return {
    getchart: getchart,
    getinfo: getinfo
  };

});