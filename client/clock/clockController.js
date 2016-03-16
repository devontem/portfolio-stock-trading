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
    if(hour <12){
      hour = '0' + hour;
    }
    var minute = currentTime.minute();
    if (minute < 10) {
      minute = '0' + minute;
    }

    var second = currentTime.second();
    if(second< 10){
      second = '0' + second;
    }

    $scope.time = hour + ' : ' + minute + ' : ' + second + ' ' + postfix + ' EST ';
  };

  $interval($scope.getCurrentTime, 1000);

}]);
