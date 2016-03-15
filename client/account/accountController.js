app.controller('AccountController', function($scope, $window, AccountFactory, $location, $rootScope){

  $scope.name = $window.localStorage.getItem('com.tp.username');
  $scope.id = $window.localStorage.getItem('com.tp.userId');

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
          console.log('HEY')
          AccountFactory.deleteAccount(userid);
          $location.path('/');
          $rootScope.$emit('deleted', {});
        } else {
          swal("Cancelled",
          "Your account is safe :)",
          "error");
        }
      });
    //AccountFactory.deleteAccount($scope.id);
    //$location.path('/');

    //$rootScope.$emit('deleted', {});
  }

  $scope.newlogin = {};
  $scope.newlogin.userId = $scope.id;
  $scope.change = false;

  $scope.edit = function(){
    $scope.change = true;
  }

  $scope.cancel = function(){
    $scope.change = false;
  }

  $scope.updateLogin = function(){
    AccountFactory.editLogin($scope.newlogin);
    $scope.newlogin = {};
    $scope.cancel();
    Materialize.toast('Your login has been updated', 2000)
  }

})