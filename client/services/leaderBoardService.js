app

  .factory('leaderBoardFactory', function($http){

    var getPortfolios = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: leagueID}
      })
      .then(function(portfolios){
        return portfolios.data;
      });
    };

    return {
      getPortfolios: getPortfolios
    };

  })