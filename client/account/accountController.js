app.controller('AccountController', ['$scope', '$window', 'AccountFactory', '$location', '$rootScope', function($scope, $window, AccountFactory, $location, $rootScope){

  $scope.name = $window.localStorage.getItem('com.tp.username');
  $scope.id = $window.localStorage.getItem('com.tp.userId');
  $scope.active = 'accountInfo';
  $scope.editMode = false;

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
  };

  $scope.getLeaguesByOwnerId = function(){
    AccountFactory.getLeaguesByOwnerId($scope.id).then(function(data){
      $scope.leagues = data;
    });
  };

  $scope.getLeaguesByOwnerId();

  $scope.getUser = function(){
    AccountFactory.getSingleUser($scope.id)
      .then(function(user){
        $scope.user = user;
        $scope.email = user.email;
        $scope.image = user.image;
      });
  };

  $scope.getUser();

  $scope.newemail = {};
  $scope.newemail.userId = $scope.id;

  $scope.newpw = {};
  $scope.newpw.userId = $scope.id;

  $scope.change = false;

  $scope.editPW = function(){
    $scope.active = 'updatepw';
    resetEditMode();
  };
  $scope.editEmail = function(){
    $scope.active = 'editEmail';
    resetEditMode();
  };
  $scope.editLeagues = function(){
    $scope.active = 'editLeagues';
    resetEditMode();
  };
  $scope.showAccount = function(){
    $scope.active = 'accountInfo';
    resetEditMode();
  };
  $scope.cancel = function(){
    $scope.newlogin = {};
  };

  $scope.toggleEditMode = function(){
    if ($scope.editMode){
      resetEditMode();
    } else {
      $scope.editMode = true;
    }
  };

  function resetEditMode(){
    $scope.editMode = false;
    $scope.currentLeague = {};
  }

  $scope.selectLeague = function(league){
    $scope.toggleEditMode();
    $scope.currentLeague = league;
  };

  $scope.editLeague = function(){
    var league = $scope.currentLeague;

    var start = moment(league.start).utc().hour(13).minute(30);
    var end = moment(league.end).utc().hour(20);
    league.start = start.format();
    league.end = end.format();

    console.log('league being sent', league);

    AccountFactory.editOneLeague(league.id, league).then(function(league){
      console.log('factory callback', league);

      swal('League Updated!', 'Everyone wants to play but nobody wants to organize the game. Good job!');
    });
  };

  var clearemailupdate = function(){
    $scope.newemail.email = '';
    $scope.newemail.confirmemail = '';
    $scope.newemail.password = '';
  };

  var clearpwupdate = function(){
    $scope.newpw.newpw = '';
    $scope.newpw.oldpw = '';
    $scope.newpw.confirmnewpw = '';
  };

  $scope.updateEmail = function(newemail){
    if(newemail.email !== newemail.confirmemail){
      Materialize.toast('Email did not match.', 2000);
      return;
    }
    AccountFactory.updateEmail($scope.newemail)
      .then(function(user){
        if(user === 'Wrong password' ){
          Materialize.toast('Incorrect Password!.', 2000);
        }else if(user === 'Email taken'){
          Materialize.toast('Email is already taken.', 2000);
        }else if(user === 'Email updated'){
          Materialize.toast('Email updated', 2000);
          clearemailupdate();
        }else{
          Materialize.toast('No user found!', 2000);
        }
      });
  };

  $scope.updatePW = function(newpw){
    if(newpw.newpw !== newpw.confirmnewpw){
      Materialize.toast('New passwords do not match.', 2000);
      return;
    }
    AccountFactory.updatePW($scope.newpw)
      .then(function(user){
        if(user === 'Wrong password' ){
          Materialize.toast('Incorrect Password!.', 2000);
        }else if(user === 'Password updated'){
          Materialize.toast('Password updated', 2000);
          clearpwupdate();
        }else{
          Materialize.toast('No user found!', 2000);
        }
      });
  };


  $scope.deleteLeague = function(){
    swal({title: "Are you sure?",
          text: "All associated portfolios and transactions will also be removed",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false },
          function(){
            swal("Deleted!", "Your league has been deleted!", "success");
            AccountFactory.deleteLeagueById($scope.currentLeague.id)
              .then(function(data){
                $scope.getLeaguesByOwnerId();
                $scope.toggleEditMode();
              });
          });
  };


  $scope.upload = function (file) {
    var r = new FileReader();
    r.onload = function(){
      AccountFactory.profileImage({
        image: r.result,
        userId: $scope.id
      })
        .then(function (resp) {
            Materialize.toast('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data, 5000);
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            Materialize.toast('Error status: ' + resp.status, 5000);
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
    r.readAsDataURL(file);
    $scope.file = file;
  };

}]);
