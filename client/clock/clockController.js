app.controller('ClockController', ['$scope', '$interval', function ($scope, $interval) {

  $scope.time;

  $scope.getCurrentTime = function () {
    var currentTime = moment().utc().subtract(4, 'hour');
    var postfix = 'AM';
    var hour = currentTime.hour();
    if (hour > 12) {
      hour -= 12;
      postfix = 'PM';
    }
    var minute = currentTime.minute();
    if (minute.length === 1) {
      minute += '0';
    }
    $scope.time = hour + ' : ' + minute + postfix;
  };

  $interval($scope.getCurrentTime, 1000);

}]);
