app.controller('orderStatusController', ['$scope', '$window', '$stateParams', 'orderStatusFactory', function($scope, $window, $stateParams, orderStatusFactory){
  
  $scope.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.leagueId = $stateParams.leagueId;

  $scope.getOrders = function(){
    var userleague = {
      userId: $scope.userId,
      leagueId: $scope.leagueId
    }
    orderStatusFactory.getOrders(userleague)
      .then(function(orders){
        $scope.orders = orders;
      })
  }

  $scope.openModal = function(){
    $('#modal2').openModal();
  }

  $scope.closeModal = function(){
    $('#modal2').closeModal();
  }

}]);
