var app = angular.module('app');

app.factory('preLeagueFactory', function($http, $stateParams){

  var getName = function(leagueId){
    return $http({
      method: 'POST',
      url: '/api/leagues/id',
      data: {id: leagueId}
    })
    .then( function (league) {
      // TODO: Structure this appropriately once you have the exact route
      return league.data.name;
    });
  }

  return {
    getName: getName
  }


})