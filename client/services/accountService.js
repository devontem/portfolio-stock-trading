app

  .factory('AccountFactory', function($http){

    var deleteAccount = function(userID){
      return $http({
        method: 'DELETE',
        url: 'api/users/',
        data: {id: userID},
        headers: {"Content-Type": "application/json;charset=utf-8"}
      })
      .then(function(user){
        console.log(user + ', successfully deleted');
      });
    };

    var editLogin = function(user){
      console.log(user.userId)
      return $http.put('api/users/'+user.userId, {
          id: user.userId,
          email: user.email,
          password: user.pass,
          oldpassword: user.oldpass
        }
      )
      .then(function(user){
        return user;
      })
    };

    var getSingleUser = function(userID){
      return $http({
        method: 'POST',
        url: 'api/users/getuser',
        data: {id: userID},
      })
      .then(function(user){
        return user.data;
      });
    };

    var getLeaguesByOwnerId = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/owner/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    var editOneLeague = function(id, data){
      return $http({
        method: 'PUT',
        url: '/api/leagues/'+id,
        data: data
      })
      .then(function(league){

      });
    }

    var deleteLeagueById = function(id, data){
      return $http({
        method: 'DELETE',
        url: '/api/leagues/'+id
      })
      .then(function(data){
        console.log(data);
      });
    }

    return {
      deleteAccount: deleteAccount,
      editLogin: editLogin,
      getSingleUser: getSingleUser,
      getLeaguesByOwnerId: getLeaguesByOwnerId,
      editOneLeague: editOneLeague,
      deleteLeagueById: deleteLeagueById
    };

  })