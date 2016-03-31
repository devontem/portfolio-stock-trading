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
    };

    var editOneLeague = function(id, data){
      return $http({
        method: 'PUT',
        url: '/api/leagues/'+id,
        data: data
      })
      .then(function(league){

      });
    };

    var deleteLeagueById = function(id, data){
      return $http({
        method: 'DELETE',
        url: '/api/leagues/'+id
      })
      .then(function(data){
        console.log(data);
      });
    };

    var profileImage = function(data){
      return $http({
        method: 'POST',
        url: 'api/users/profileimage',
        data: data,
      })
      .then(function(user){
        return user.data;
      });
    };

    var updateEmail = function(newemail){
      return $http({
        method: 'POST',
        url: 'api/users/updateemail',
        data: newemail
      })
      .then(function(user){
        return user.data;
      })
    };

    var updatePW = function(newpw){
      return $http({
        method: 'POST',
        url: 'api/users/updatepw',
        data: newpw
      })
      .then(function(user){
        return user.data;
      })
    };


    return {
      deleteAccount: deleteAccount,
      editLogin: editLogin,
      getSingleUser: getSingleUser,
      getLeaguesByOwnerId: getLeaguesByOwnerId,
      editOneLeague: editOneLeague,
      deleteLeagueById: deleteLeagueById,
      getSingleUser: getSingleUser,
      profileImage: profileImage,
      updateEmail: updateEmail,
      updatePW: updatePW
    };

  })