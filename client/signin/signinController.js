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

  $scope.showsignup = false;
  $scope.toggleSignup = function() {
    $scope.showsignup = !$scope.showsignup;
  };

  $scope.showlogin = false;
  $scope.toggleLogin = function() {
    $scope.showlogin = !$scope.showlogin;
  };

  $scope.signup = function(user){
    Auth.createuser(user).then(function(token){
      $window.sessionStorage.token = token;
      console.log(token)
    });
  }
})

//factor, move it to a centralize factory later!
.factory('Auth', function($http, $location){

  var createuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users/users',
      data: user
    })
    .then(function(token){
      return token;
    });
  };

  return {
    createuser: createuser
  };

});
