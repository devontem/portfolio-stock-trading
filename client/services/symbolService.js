var app = angular.module('app');

app.factory('symbolFactory', function($http){

  var getCompany = function(company){
    return $http({
      method: 'GET',
      url: '/api/symbols/'+company,
    })
    .then( function (data) {
      console.log(data)
      return data;
    });
  }

  return {
    getCompany: getCompany
  }

})