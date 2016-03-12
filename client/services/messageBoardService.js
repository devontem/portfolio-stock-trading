app

  .factory('messageBoardFactory', function($http){

    var getPosts = function(leagueID){
      return $http({
        method: 'GET',
        url: '/api/leagues/getPosts',
        data: {leagueId: leagueID}
      })
      .then(function(posts){
        return posts;
      });
    };

    return {
      getPosts: getPosts
    };
