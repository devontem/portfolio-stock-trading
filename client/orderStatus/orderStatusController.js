app.controller('orderStatusController', ['$scope', '$window', '$stateParams', 'orderStatusFactory', function($scope, $window, $stateParams, orderStatusFactory){

  $scope.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.leagueId = $stateParams.leagueId;

  //retrieve user orders
  $scope.getOrders = function(){
    var userleague = {
      userId: $scope.userId,
      leagueId: $scope.leagueId
    };
    orderStatusFactory.getOrders(userleague)
      .then(function(orders){
        $scope.orders = orders;
      });
  };

  //open modal for order status
  $scope.openModal = function(){
    $('#modal2').openModal();
  };

  //close modal for order status
  $scope.closeModal = function(){
    $('#modal2').closeModal();
  };

  //allow user to cancel open orders
  $scope.cancel = function(orderid){
    swal({   title: "Are you sure?",
      text: "Cancel this order.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel please!",
      closeOnConfirm: false,},
      function(isConfirm){
        if (isConfirm) {
          swal("Deleted!",
            "Your order has been canceled.",
            "success");
          orderStatusFactory.cancelOrder(orderid);
          $('#modal2').closeModal();
        }
      });
  };

}]);
