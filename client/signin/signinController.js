app

//modal for signup
.directive('signupDirective', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width) {
        scope.dialogStyle.width = attrs.width;
      }
      if (attrs.height) {
        scope.dialogStyle.height = attrs.height;
      }
      scope.hidesignup = function() {
        scope.show = false;
      };
    },
    transclude: true,
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hidesignup()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
})

//modal for login
.directive('loginDirective', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width) {
        scope.dialogStyle.width = attrs.width;
      }
      if (attrs.height) {
        scope.dialogStyle.height = attrs.height;
      }
      scope.hidelogin = function() {
        scope.show = false;
      };
    },
    transclude: true,
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hidelogin()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
})

//modal for forgot password
.directive('forgotDirective', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width) {
        scope.dialogStyle.width = attrs.width;
      }
      if (attrs.height) {
        scope.dialogStyle.height = attrs.height;
      }
      scope.hideforgot = function() {
        scope.show = false;
      };
    },
    transclude: true,
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideforgot()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
})

//signin signup controller
.controller('SigninController', ['$scope', '$window', 'Auth', 'DirectMessage', '$rootScope', 'DashboardFactory', 'LeagueInvite', function($scope, $window, Auth, DirectMessage, $rootScope, DashboardFactory, LeagueInvite){
  $scope.user = {};
  $scope.id = $window.localStorage.getItem('com.tp.userId') || undefined;
  $scope.username;

  // initialize side menu
  $(document).ready(function(){
    $(".button-collapse").sideNav();
  });

  $scope.authorize = function(){
    if(Auth.isAuth()){
      $scope.loggedin = true;
      $scope.username = $window.localStorage.getItem('com.tp.username');
    }else{
      $scope.loggedin = false;
    }
  };

  $scope.authorize();

  $rootScope.$on('deleted', function(){
    $scope.loggedin = false;
  });

  $scope.showsignup = false;
  $scope.toggleSignup = function() {
    $scope.showsignup = !$scope.showsignup;
  };

  $scope.showlogin = false;
  $scope.toggleLogin = function() {
    $scope.showlogin = !$scope.showlogin;
  };

  $scope.showforgot = false;
  $scope.toggleForgot = function() {
    $scope.showforgot = !$scope.showforgot;
    $scope.emailsent = false;
  };

  $scope.forgot = function(){
    $scope.toggleLogin();
    $scope.toggleForgot();
  };

  $scope.emailsent = false;
  $scope.forgotpassword = function(email){
    if(email) $window.localStorage.setItem('email', email);
    if(!email) email = $window.localStorage.getItem('email');
    Auth.forgotpw(email)
      .then(function(data){
        if(data === 'User not found'){
          Materialize.toast('Cannot find the email you entered', 1000);
        }else{
          $scope.emailsent = true;
        }
      });
  };

  //clear out input fields
  $scope.clearsignup = function(){
    $scope.user.username = '';
    $scope.user.password = '';
    $scope.user.email = '';
  };

  //new user signup
  $scope.signup = function(user){
    Auth.createuser(user)
      .then(function(data){
        if(data === 'Email already in use'){
          Materialize.toast('Email already in use.', 2000);
          $scope.clearsignup();
        }else if(data === 'Username already exist'){
          Materialize.toast('Username is taken.', 2000);
          $scope.clearsignup();
        }else if(data.token){
          $window.localStorage.setItem('com.tp', data.token);
          $window.localStorage.setItem('com.tp.userId', data.userId);
          $window.localStorage.setItem('com.tp.username', data.username);
          $scope.username = $window.localStorage.getItem('com.tp.username');
          $scope.id = $window.localStorage.getItem('com.tp.userId');
          $scope.toggleSignup();
          $scope.loggedin = true;
          $window.location.href = '/#/dashboard';
        }
      });
  };

  //user login
  $scope.signin = function(user){
    Auth.loginuser(user).then(function(data){
      if(data === 'User not found'){
        Materialize.toast('No user found.', 2000);
        $scope.clearsignup();
      }else if(data === 'Wrong password'){
        Materialize.toast('Incorrect password.', 2000);
        $scope.clearsignup();
      }else if(data.token){
        $window.localStorage.setItem('com.tp', data.token);
        $window.localStorage.setItem('com.tp.userId', data.userId);
        $window.localStorage.setItem('com.tp.username', data.username);
        $scope.username = $window.localStorage.getItem('com.tp.username');
        $scope.id = $window.localStorage.getItem('com.tp.userId');
        $scope.toggleLogin();
        $scope.loggedin = true;
        $window.location.href = '/#/dashboard';
        $rootScope.$emit('userSignedIn');
      }else{
        $window.location.href = '/#/';
      }
    });
  };

  //remove everything from localstorage
  $scope.logout = function(user){
    $scope.loggedin = false;
    $window.localStorage.removeItem('com.tp');
    $window.localStorage.removeItem('com.tp.userId');
    $window.localStorage.removeItem('com.tp.username');
    $window.location.href = '/#/';
  };

  //get all user's leagues
  $scope.getUserLeagues = function () {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.getUserLeagues(userId)
      .then(function(userLeagues){
        $scope.userLeagues = userLeagues;
      });
  };

  $rootScope.$on('userSignedIn', function(){
     $scope.getUserLeagues();
   });

  $rootScope.$on('newleague', function(){
    $scope.getUserLeagues();
  });

  // Handle's Messages Notifications
  function getOpenAndUnreadMessages(){
    counter = 0;
    DirectMessage.getOpenAndUnreadMessages($scope.id).then(function(data){
      //if current user was last person to send message, set message thread status to be read
      data = data.map(function(message){
        if ($scope.id == message.UserId){
          message.read = true;
          return message;
        } else if (!!!message.read){
          //if a message is unread, adds it to the counter
          counter++;
        }
        return message;
      });

      // only update it ng-model if value changes
      if (counter !== $scope.unreadMessages){
        $scope.unreadMessages = counter;
      }

    });
  }

  function getInvitesByUserId(){
    LeagueInvite.getInvitesByUserId($scope.id).then(function(data){
      $scope.invites = data;

      // updating counter
      var counter = 0;
      $scope.invites.forEach(function(invite){
        if (!invite.read) {
          counter++;
        }
      });
      $scope.unreadInvites = counter;
    });
  }

  function updateMessageCenter(){
    getOpenAndUnreadMessages();
    getInvitesByUserId();
  }

  if ($scope.id){
    updateMessageCenter();
    //setInterval(updateMessageCenter, 3000); // remove polling for time being
    $scope.getUserLeagues();
  }

  $scope.notdone = function(league){
    return !league.leagueEnded;
  };

}]);
