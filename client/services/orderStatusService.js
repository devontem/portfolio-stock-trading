app.factory('orderStatusFactory', function($http){

  var getOrders = function(data){
    return $http({
      method: 'POST',
      url: 'api/transactions/getorders',
      data: data,
      headers: {"Content-Type": "application/json;charset=utf-8"}
    })
    .then(function(orders){
      return orders.data;
    });
  }

  return {
    getOrders: getOrders
  }

})