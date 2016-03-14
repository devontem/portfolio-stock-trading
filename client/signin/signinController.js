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
      }
    },
    transclude: true,
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hidesignup()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  }
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
      }
    },
    transclude: true,
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hidelogin()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  }
})

//signin signup controller
.controller('SigninController', function($scope, $window, Auth){
  $scope.user = {};
  $scope.loggedin = false;
  $scope.username;

  $scope.showsignup = false;
  $scope.toggleSignup = function() {
    $scope.showsignup = !$scope.showsignup;
  };

  $scope.showlogin = false;
  $scope.toggleLogin = function() {
    $scope.showlogin = !$scope.showlogin;
  };

  $scope.signup = function(user){
    Auth.createuser(user).then(function(data){
      $window.localStorage.setItem('com.tp', data.token);
      $window.localStorage.setItem('com.tp.userId', data.userId);
      $window.localStorage.setItem('com.tp.username', data.username);
      $scope.username = $window.localStorage.getItem('com.tp.username');
      $scope.toggleSignup();
      $scope.loggedin = true;
      $window.location.href = '/#/dashboard';
    });
  }

  $scope.signin = function(user){
    Auth.loginuser(user).then(function(data){
      if(data.token){
        $window.localStorage.setItem('com.tp', data.token);
        $window.localStorage.setItem('com.tp.userId', data.userId);
        $window.localStorage.setItem('com.tp.username', data.username);
        $scope.username = $window.localStorage.getItem('com.tp.username');
        $scope.toggleLogin();
        $scope.loggedin = true;
        $window.location.href = '/#/dashboard';
      }else{
        $window.location.href = '/#/';
      }
    });
  }

  $scope.logout = function(user){
    $scope.loggedin = false;
    $window.localStorage.removeItem('com.tp');
    $window.localStorage.removeItem('com.tp.userId');
    $window.localStorage.removeItem('com.tp.username');
    $window.location.href = '/#/';
  }
})

