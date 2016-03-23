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


  return {
    getchart: getchart,
  };

});