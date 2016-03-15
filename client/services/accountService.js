app

  .factory('AccountFactory', function($http){

    var deleteAccount = function(userID){

      return $http({
        method: 'DELETE',
        url: 'api/users/',
        data: {id: userID}
      })
      .then(function(user){
        console.log(user + ', successfully deleted')
      });
    };

    var editLogin = function(user){
      console.log('Frontend USER: ', user)
      return $http({
        method: 'POST',
        url: 'api/users/',
        data: {
          id: user.userId,
          email: user.email,
          password: user.pass
        }
      })
      .then(function(user){
        console.log(user + 'login info successfully edited')
      })
    }

    return {
      deleteAccount: deleteAccount,
      editLogin: editLogin
    };

  })