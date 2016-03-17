app.controller('AccountController', function($scope, $window, AccountFactory, $location, $rootScope){

  $scope.name = $window.localStorage.getItem('com.tp.username');
  $scope.id = $window.localStorage.getItem('com.tp.userId');
  $scope.active = 'accountInfo';

  $scope.delete = function(){
    var userid = $scope.id;
    swal({   title: "Are you sure?",
      text: "You will not be able to recover.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel please!",
      closeOnConfirm: false,
      closeOnCancel: false },
      function(isConfirm){
        if (isConfirm) {
          swal("Deleted!",
           "Your account has been deleted.",
            "success");
          AccountFactory.deleteAccount(userid);
          $location.path('/');
          $rootScope.$emit('deleted', {});
        } else {
          swal("Cancelled",
          "Your account is safe :)",
          "error");
        }
      });

  }

  $scope.getUser = function(){
    AccountFactory.getSingleUser($scope.id)
      .then(function(user){
        $scope.user = user;
        $scope.email = user.email;
      })
  }

  $scope.getUser();

  $scope.newlogin = {};
  $scope.newlogin.userId = $scope.id;
  $scope.change = false;

  $scope.edit = function(){
    $scope.active = 'editLogin';
    console.log($scope.active);
  }
  $scope.showAccount = function(){
    $scope.active = 'accountInfo';
  }

  $scope.cancel = function(){
    $scope.newlogin = {};
  }

  $scope.updateLogin = function(){
    console.log('hielfd')
    AccountFactory.editLogin($scope.newlogin)
      .then(function(user){
        if(user.data === "Wrong old password"){
          Materialize.toast('You entered the wrong old password!', 2000);
        }else if(user.data === "Email already taken"){
          Materialize.toast('New Email already taken, please use another Email.', 2000)
        }else{
          $scope.newlogin = {};
          $scope.cancel();
          Materialize.toast('Your login has been updated', 2000)
        }
      });
  }

})