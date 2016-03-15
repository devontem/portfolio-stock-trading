var app = angular.module('app');

app.factory('preLeagueFactory', function($http, $stateParams){

  var getName = function(leagueId){
    return $http({
      method: 'GET',
      url: '/api/leagues/'+leagueId,
    })
    .then( function (league) {
      return league.data.name;
    });
  }

  return {
    getName: getName
  }


})