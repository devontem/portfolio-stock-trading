app.factory('transactionFactory', function ($http){

  var getleagueTransactions = function(arr) {
    return $http({
      method: 'Post',
      url: '/api/recentTransactions/',
      data: {'data':arr}
    });
  };
  return {
    getleagueTransactions: getleagueTransactions
  };
});
