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
        console.log(user + ', successfully deleted')
      });
    };

    var editLogin = function(user){
      console.log(user.userId)
      return $http.put('api/users/'+user.userId, {
          id: user.userId,
          email: user.email,
          password: user.pass
        }
      )
      .then(function(user){
        console.log(user + 'login info successfully edited')
      })
    }

    return {
      deleteAccount: deleteAccount,
      editLogin: editLogin
    };

  })