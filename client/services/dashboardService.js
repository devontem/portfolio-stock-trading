app

  .factory('DashboardFactory', function($http){

    var addLeague = function(league){
      return $http({
        method: 'POST',
        url: '/api/leagues',
        data: league
      })
      .then( function(league){
        return league.data;
      })
    }

    var joinLeague = function(leagueId, userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/joinleague',
        data: { leagueId: leagueId,
                userId: userId }
      })
      .then( function(data){
        return data;
      })
    }

    var getUserLeagues = function(userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/userleague',
        data: {userId: userId}
      })
      .then( function (portfolios) {
        // TODO: Structure this appropriately once you have the exact route
        return portfolios.data;
      }
      );
    };

    var getAvailLeagues = function(){
      return $http({
        method: 'GET',
        url: '/api/leagues/'
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    };

    var getLeagueById = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    return {
      addLeague: addLeague,
      getUserLeagues: getUserLeagues,
      getAvailLeagues: getAvailLeagues,
      joinLeague: joinLeague,
      getLeagueById: getLeagueById
    };

  })
