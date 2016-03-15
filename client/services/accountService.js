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

    return {
      deleteAccount: deleteAccount
    };

  })