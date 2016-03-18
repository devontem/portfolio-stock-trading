angular.module('app.dashboard', [])

.directive("formatDate", function(){
  return {
   require: 'ngModel',
    link: function(scope, elem, attr, modelCtrl) {
      modelCtrl.$formatters.push(function(modelValue){
        return new Date(modelValue);
      });
    }
  };
})

.directive('addleagueDirective', function() {
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
      scope.hideadd = function() {
        scope.show = false;
      };
    },
    transclude: true,
    template: "<div class='ng-modal' ng-show='show'><div class='ng-modal-overlay' ng-click='hideadd()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-dialog-content' ng-transclude></div></div></div>"
  };
})

.controller('DashboardController', ['$scope', '$window', 'DashboardFactory', 'leaderBoardFactory', function ($scope, $window, DashboardFactory, leaderBoardFactory) {

  $scope.currentTab = 'user';
  $scope.leagues;
  $scope.league = {};
  $scope.portfolios = {};
  $scope.numtojoin = 0;
  $scope.league.isPrivate = "false";


  $scope.pickstart = function(){
    var start = $('#startdate').pickadate({
      onSet: function (context) {
        $scope.league.start = new Date(context.select);
      },
      onClose: function() {
          $('#startdate').focus();
      },
      selectMonths: true,
      selectYears: 15,
      editable: true
    });
    var picker = start.pickadate('picker');
    start.on('click', function(event) {
        if (picker.get('open')) {
            picker.close();
        } else {
            picker.open();
        }
        event.stopPropagation();
    });
  }

  $scope.pickend = function(){
    var end = $('#enddate').pickadate({
      onSet: function (context) {
        $scope.league.end = new Date(context.select)
      },
      onClose: function() {
          $('#enddate').focus();
      },
      selectMonths: true,
      selectYears: 15,
      editable: true
    });
    var pickers = end.pickadate('picker');
    end.on('click', function(event) {
        if (pickers.get('open')) {
            pickers.close();
        } else {
            pickers.open();
        }
        event.stopPropagation();
    });
  }

  //toggle add form
  $scope.showadd = false;
  $scope.toggleAdd = function(){
    $scope.showadd = !$scope.showadd;
  };

  $scope.addLeague = function (league) {
    var start = moment(league.start).utc().hour(13).minute(30);
    var end = moment(league.end).utc().hour(20);
    league.start = start.format();
    league.end = end.format();


    var creatorName = $window.localStorage.getItem('com.tp.username');
    var creatorId = $window.localStorage.getItem('com.tp.userId');
    league['creatorId']= creatorId;
    league['creatorName']= creatorName;

    league.private = JSON.parse(league.isPrivate);
    DashboardFactory.addLeague(league)
      .then(function(league){
        $scope.toggleAdd();
        console.log('league info new$$', league)
        if (league.private === true){
          console.log('it is private')
          swal({
            title: "Private League Password",
            text: "<p style='font-size: 1.2em'>Send this code to friends and have them enter it in the dashboard. <br /> <br /><div style='font-size: 1.6em' class='chip'><b>"+league.code+"</b></div>",
            html: true
          });
        }

        $window.location.href = '/#/leagues/'+league.id;
      });
  };

  $scope.showToJoin = function () {
    $scope.currentTab = 'toJoin';

  };

  $scope.showUserLeagues = function () {
    $scope.currentTab = 'user';
  };

  $scope.getUserLeagues = function () {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.getUserLeagues(userId)
      .then(function(portfolios){
        $scope.portfolios = portfolios;
      });
  };

  $scope.joinLeague = function (leagueId) {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.joinLeague(leagueId, userId)
      .then(function(){
        $window.location.href = '/#/leagues/'+leagueId.toString();
      });
  };
//returns all public leagues
//


  $scope.getLeaguesToJoin = function () {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.getAvailLeagues()
      .then(function(leagues){
        $scope.leagues = leagues;
        console.log($scope.leagues)
        $scope.numtojoin = $scope.leagues.length - $scope.portfolios.length;


        // to grab # of portfolios per league to know # of users joined
        for(var i = 0; i < $scope.leagues.length; i++){

          (function(index){
            $scope.leagues[index].usersJoined = 0;
            leaderBoardFactory.getPortfolios($scope.leagues[index].id)
              .then(function(portfolio){
                $scope.leagues[index].usersJoined = portfolio.length;
              })
          })(i)
        }

      });
  };


  $scope.notjoined = function(league){
    for(var i=0; i<$scope.portfolios.length; i++){
      if(league.id === $scope.portfolios[i].leagueId) return false;
    }
    return true;
  };

  $scope.notprivate = function(league){
    return !league.private;
  }

  $scope.notfull = function(league){
    if(league.maxNum - league.usersJoined > 0){
      return true;
    }
  }

  $scope.notstarted = function(league){
    var now = new Date();
    var convertedNow = moment.utc(now).format();
    var start = league.start;
    console.log('NOW:', convertedNow)
    console.log('START:', start)
    if(convertedNow <= start){
      console.log('TRUE NOW IS BEFORE START')
      return true;
    }
  }

  $scope.joinPrivate = function(){
    swal({title: "Join a Private League",
          text: "If you don't know the league code, ask the league owner.",
          type: "input",
          showCancelButton: true,
          closeOnConfirm: false,
          animation: "slide-from-top",
          inputPlaceholder: ""
        }, function(inputValue){
          if (inputValue === false) return false;
          if (inputValue === "") {
            swal.showInputError("You need to write something!");
            return false
          }

          var found = false;
          for (var i = 0; i < $scope.leagues.length; i++){
            if ($scope.leagues[i].private && $scope.leagues[i].code === inputValue){
              found = true;
              if ($scope.notjoined($scope.leagues[i])){
                swal("Nice!", "Joining the league: "+ $scope.leagues[i].name);
                $scope.joinLeague($scope.leagues[i].id);
              } else {
                swal.showInputError("You are already in this league!");
                return false;
              }
              break;
            }
          }
          if (!found){
            swal.showInputError("Invalid Code.");
            return false;
          }
        });
  }

  $scope.getUserLeagues();
  $scope.getLeaguesToJoin();

}]);
