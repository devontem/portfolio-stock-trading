app

  .factory('leaderBoardFactory', function($http){

    var getMembers = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: 1}
      })
      .then(function(members){
        return members;
      });
    };

    return {
      getMembers: getMembers
    };

  })