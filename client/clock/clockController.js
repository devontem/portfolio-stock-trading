app.controller('ClockController', ['$scope', '$interval', function ($scope, $interval) {

  $scope.time;

  //get time til market opens
  $scope.getCurrentTime = function () {

    //get current time with momentjs
    var currentTime = moment().utc().subtract(7, 'hour');
    var warning = 'until stock market opens';
    var hour = currentTime.hour();
    var minute = currentTime.minute();
    var second = currentTime.second();
    second = 60 - second;

    //calculate time til market opens/close
    if((hour>6 && hour <13) || (hour===6 && minute>=30)){
      hour = 12 - hour;
      warning = 'until stock market closes';
      minute = 59 - minute;

    } else if(hour >= 13){
      if(minute>=30){
        minute = 30-minute+60;
      }else if(minute<30){
        minute = 29 - minute;
      }
      hour = minute > 30 ? hour+1 : hour;
      hour = 30-hour;
    }else{
      if(minute>=30){
        minute = 30-minute+60;
      }else if(minute<30){
        minute = 29 - minute;
      }
      hour = minute > 30 ? hour+1 : hour;
      hour = 6-hour;
    }

    if(hour < 10){
      hour = '0' + hour;
    }

    if(second < 10){
      second = '0' + second;
    }

    if (minute < 10) {
      minute = '0' + minute;
    }

    $scope.time = hour + ':' + minute + ':' + second + ' ' + warning;
  };

  $interval($scope.getCurrentTime, 1000);

}]);
