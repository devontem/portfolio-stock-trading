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

    return {
      deleteAccount: deleteAccount,
      editLogin: editLogin,
      getSingleUser: getSingleUser
    };

  })