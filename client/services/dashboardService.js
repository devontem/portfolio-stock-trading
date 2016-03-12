app

  .factory('DashboardFactory', function($http){

    var addLeague = function(league){
      return $http({
        method: 'POST',
        url: '/api/leagues',
        data: league
      })
      .then( function(data){
        return data;
      })
    }

    var joinLeague = function(leagueId, userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/joinleague',
        data: { leagueId: leagueId,
                userId: userId,
                balance: 100000 }
      })
      .then( function(data){
        return data;
      })
    }

    var getUserLeagues = function(user){
      return $http({
        method: 'GET',
        url: '/api/',
        data: user
      })
      .then( function (data) {
        // TODO: Structure this appropriately once you have the exact route
        return data;
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

    return {
      addLeague: addLeague,
      getUserLeagues: getUserLeagues,
      getAvailLeagues: getAvailLeagues,
      joinLeague: joinLeague
    };

  })
