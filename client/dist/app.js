
var app = angular.module('app', ['ui.router', 'app.dashboard', 'app.portfolio', 'app.botbar', 'app.leagueResults', 'ngFileUpload', 'app.profile', 'angularCharts', 'ngSanitize']);


  app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      // .state('symbol', {
      //   url: '/symbol',
      //   controller: 'SymbolController',
      //   templateUrl: 'symbol/symbol.html'

      // })

      .state('signin', {
        url: '/',
        authenticate: true,
        controller: 'SigninController',
        controllerAs: 'signin',
        templateUrl: 'signin/signin.html'
      })

      .state('dashboard', {
        url: '/dashboard',
        authenticate: true,
        views: {
          '': {
            controller: 'DashboardController',
            controllerAs: 'dashboard',
            templateUrl: 'dashboard/dashboard.html'
          },
          'badge@dashboard': {
            controller: 'BadgeController',
            controllerAs: 'badge',
            templateUrl: 'badges/badge.html'
          },
        }


      })

      .state('forum', {
        url: '/forum',
        authenticate: true,
        controller: 'MainForumController',
        templateUrl: 'forum/main.html'
      })

      .state('topic', {
        url: '/topics/:topicId',
        authenticate: true,
        controller: 'TopicController',
        templateUrl: 'topic/topic.html'
      })

      .state('account', {
        url: '/account',
        authenticate: true,
        controller: 'AccountController',
        templateUrl: 'account/account.html'
      })

      .state('profiles', {
        url: '/profiles/:userId',
        authenticate: false,
        controller: 'ProfileController',
        templateUrl: 'profile/profile.html'
      })

      .state('league', {
        url: '/leagues/:leagueId',
        authenticate: true,
        views: {
          /*main view of the entire league template*/
          '': {
            templateUrl: 'league/league.html',
            controller: 'LeagueController'
          },

          'order@league': {
            controller: 'orderStatusController',
            templateUrl: 'orderStatus/orderStatus.html'
          },
          // portfolio view within the league page
          'portfolio@league': {
            controller: 'PortfolioController',
            controllerAs: 'portfolio',
            templateUrl: 'portfolio/portfolio.html'
          },
          // leaderboard view within league page
          'leaderboard@league': {
            controller: 'LeaderBoardController',
            controllerAs: 'leaderboard',
            templateUrl: 'leaderboard/leaderboard.html'
          },
          // news/analysis view within league page

          'news@league': {
            controller: 'NewsController',
            templateUrl: 'news/news.html'
          },

          'recentTransactions@league': {
            controller: 'recentTransactionsController',
            templateUrl: 'recentTransactions/recentTransactions.html'
          },

          'messageboard@league': {
            controller: 'MessageBoardController',
            templateUrl: 'messageboard/messageboard.html'
          },

          'leagueResults@league': {
            controller: 'LeagueResultsController',
            templateUrl: 'leagueResults/leagueResults.html'
          },
          'preleague@league': {
            controller: 'PreLeagueController',
            templateUrl: 'preleague/preleague.html'
          },
          'symbol@league':{
            controller: 'SymbolController',
            templateUrl: 'symbol/symbol.html'
          },
          'chart@league':{
            controller: 'PortfolioChartController',
            templateUrl: 'portfolioChart/portfolioChart.html'
          }
        }
      })

    $httpProvider.interceptors.push('AttachTokens');

  }]);

app.factory('AttachTokens', function($window) {
    // this is an $httpInterceptor
    // its job is to stop all out going request
    // then look in local storage and find the user's token
    // then add it to the header so the server can validate the request
    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('com.tp');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(function($rootScope, $location, Auth) {
    // here inside the run phase of angular, our services and controllers
    // have just been registered and our app is ready
    // however, we want to make sure the user is authorized
    // we listen for when angular is trying to change routes
    // when it does change routes, we then look for the token in localstorage
    // and send that token to the server to see if it is a real user or hasn't expired
    // if it's not valid, we then redirect back to signin/signup
    $rootScope.$on('$stateChangeStart', function(evt, next, current) {
      // if (next.$$state && next.$$state.authenticate && !Auth.isAuth()) {
      if (!Auth.isAuth()) {
        $location.path('/');
      }
    });
  });


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

  $scope.newlogin = {};
  $scope.newlogin.userId = $scope.id;
  $scope.change = false;

  $scope.editLogin = function(){
    $scope.active = 'editLogin';
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

  $scope.updateLogin = function(){
    AccountFactory.editLogin($scope.newlogin)
      .then(function(user){
        if(user.data === "Wrong old password"){
          Materialize.toast('You entered the wrong old password!', 2000);
        }else if(user.data === "Email already taken"){
          Materialize.toast('New Email already taken, please use another Email.', 2000);
        }else{
          $scope.newlogin = {};
          $scope.cancel();
          Materialize.toast('Your login has been updated', 2000);
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

app.controller('BadgeController', ['$scope', 'BadgeFactory', '$window', function($scope, BadgeFactory, $window){
  var userId = $window.localStorage.getItem('com.tp.userId');
  $scope.badges = [];
  $scope.possibleBadges = [];

  $scope.getBadges = function () {
    BadgeFactory.getBadges(userId).then(
      function (res) {
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.badges.push(badgeFormatted);
        });
      }
    );
  };

  $scope.getPossibleBadges = function () {
    BadgeFactory.getPossibleBadges(userId).then(
      function (res) {
        console.log(res);
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.possibleBadges.push(badgeFormatted);
        });
      }
    );
  };


  $scope.postBadge = function (userId, badge) {
    BadgeFactory.postBadge(userId, badge);
  };

  $scope.postBadge(1, 2);
  $scope.postBadge(1, 3);

  // loads all badges that the user has earned so far
  $scope.getBadges();
  // loads all badges that hte user has not earned
  $scope.getPossibleBadges();

}]);

angular.module('app.botbar', [])

// TODO: likely change portofolio factory name to be more precise
.controller('BotBarController',['$scope', 'Portfolio', '$interval', function($scope, Portfolio, $interval){
  // Initializes variable if the user has not searched yet
  $scope.hasSearched = false;

  $scope.stockSearch = function () {
    var stockName = $scope.stockInput.toUpperCase();
    Portfolio.getStock(stockName).then(function(stock){
      if(!stock.Ask){
        Materialize.toast('Please enter valid symbol!', 3000);
      }
      else{
        $scope.stock = stock;
        $scope.hasSearched = true;
    }
    });
    $scope.stockInput = "";
  };

}]);

app.controller('ClockController', ['$scope', '$interval', function ($scope, $interval) {

  $scope.time;

  $scope.getCurrentTime = function () {
    var currentTime = moment().utc().subtract(7, 'hour');
    var warning = 'until stock market opens';
    var hour = currentTime.hour();
    var minute = currentTime.minute();
    var second = currentTime.second();
    second = 60 - second;

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

  $scope.sortStart = 'start';
  $scope.sortEnd = 'endDate';
  $scope.sortReverse = false;


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
  };

  $scope.pickend = function(){
    var end = $('#enddate').pickadate({
      onSet: function (context) {
        $scope.league.end = new Date(context.select);
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
  };

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
    league.creatorId = creatorId;
    league.creatorName = creatorName;

    league.private = JSON.parse(league.isPrivate);
    DashboardFactory.addLeague(league)
      .then(function(league){
        $scope.toggleAdd();
        if (league.private === true){
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

        for(var i = 0; i < $scope.portfolios.length; i++){

          (function(index){
            $scope.portfolios[index].endDate = '';
            DashboardFactory.getLeagueById($scope.portfolios[index].id)
              .then(function(league){
                $scope.portfolios[index].endDate = league.end;
              })
          })(i)
        }

      })
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
  };

  $scope.notfull = function(league){
    if(league.maxNum - league.usersJoined > 0){
      return true;
    }
  }

  $scope.notstarted = function(league){
    var now = new Date();
    var convertedNow = moment.utc(now).format();
    var start = league.start;

    if(convertedNow <= start){
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
            return false;
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
  };

  $scope.getUserLeagues();
  $scope.getLeaguesToJoin();

}]);


var app = angular.module('app', ['ui.router', 'app.dashboard', 'app.portfolio', 'app.botbar', 'app.leagueResults', 'ngFileUpload', 'app.profile', 'angularCharts', 'ngSanitize']);


  app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      // .state('symbol', {
      //   url: '/symbol',
      //   controller: 'SymbolController',
      //   templateUrl: 'symbol/symbol.html'

      // })

      .state('signin', {
        url: '/',
        authenticate: true,
        controller: 'SigninController',
        controllerAs: 'signin',
        templateUrl: 'signin/signin.html'
      })

      .state('dashboard', {
        url: '/dashboard',
        authenticate: true,
        views: {
          '': {
            controller: 'DashboardController',
            controllerAs: 'dashboard',
            templateUrl: 'dashboard/dashboard.html'
          },
          'badge@dashboard': {
            controller: 'BadgeController',
            controllerAs: 'badge',
            templateUrl: 'badges/badge.html'
          },
        }


      })

      .state('forum', {
        url: '/forum',
        authenticate: true,
        controller: 'MainForumController',
        templateUrl: 'forum/main.html'
      })

      .state('topic', {
        url: '/topics/:topicId',
        authenticate: true,
        controller: 'TopicController',
        templateUrl: 'topic/topic.html'
      })

      .state('account', {
        url: '/account',
        authenticate: true,
        controller: 'AccountController',
        templateUrl: 'account/account.html'
      })

      .state('profiles', {
        url: '/profiles/:userId',
        authenticate: false,
        controller: 'ProfileController',
        templateUrl: 'profile/profile.html'
      })

      .state('league', {
        url: '/leagues/:leagueId',
        authenticate: true,
        views: {
          /*main view of the entire league template*/
          '': {
            templateUrl: 'league/league.html',
            controller: 'LeagueController'
          },

          'order@league': {
            controller: 'orderStatusController',
            templateUrl: 'orderStatus/orderStatus.html'
          },
          // portfolio view within the league page
          'portfolio@league': {
            controller: 'PortfolioController',
            controllerAs: 'portfolio',
            templateUrl: 'portfolio/portfolio.html'
          },
          // leaderboard view within league page
          'leaderboard@league': {
            controller: 'LeaderBoardController',
            controllerAs: 'leaderboard',
            templateUrl: 'leaderboard/leaderboard.html'
          },
          // news/analysis view within league page

          'news@league': {
            controller: 'NewsController',
            templateUrl: 'news/news.html'
          },

          'recentTransactions@league': {
            controller: 'recentTransactionsController',
            templateUrl: 'recentTransactions/recentTransactions.html'
          },

          'messageboard@league': {
            controller: 'MessageBoardController',
            templateUrl: 'messageboard/messageboard.html'
          },

          'leagueResults@league': {
            controller: 'LeagueResultsController',
            templateUrl: 'leagueResults/leagueResults.html'
          },
          'preleague@league': {
            controller: 'PreLeagueController',
            templateUrl: 'preleague/preleague.html'
          },
          'symbol@league':{
            controller: 'SymbolController',
            templateUrl: 'symbol/symbol.html'
          },
          'chart@league':{
            controller: 'PortfolioChartController',
            templateUrl: 'portfolioChart/portfolioChart.html'
          }
        }
      })

    $httpProvider.interceptors.push('AttachTokens');

  }]);

app.factory('AttachTokens', function($window) {
    // this is an $httpInterceptor
    // its job is to stop all out going request
    // then look in local storage and find the user's token
    // then add it to the header so the server can validate the request
    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('com.tp');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(function($rootScope, $location, Auth) {
    // here inside the run phase of angular, our services and controllers
    // have just been registered and our app is ready
    // however, we want to make sure the user is authorized
    // we listen for when angular is trying to change routes
    // when it does change routes, we then look for the token in localstorage
    // and send that token to the server to see if it is a real user or hasn't expired
    // if it's not valid, we then redirect back to signin/signup
    $rootScope.$on('$stateChangeStart', function(evt, next, current) {
      // if (next.$$state && next.$$state.authenticate && !Auth.isAuth()) {
      if (!Auth.isAuth()) {
        $location.path('/');
      }
    });
  });


app.controller('BadgeController', ['$scope', 'BadgeFactory', '$window', function($scope, BadgeFactory, $window){
  var userId = $window.localStorage.getItem('com.tp.userId');
  $scope.badges = [];
  $scope.possibleBadges = [];

  $scope.getBadges = function () {
    BadgeFactory.getBadges(userId).then(
      function (res) {
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.badges.push(badgeFormatted);
        });
      }
    );
  };

  $scope.getPossibleBadges = function () {
    BadgeFactory.getPossibleBadges(userId).then(
      function (res) {
        console.log(res);
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.possibleBadges.push(badgeFormatted);
        });
      }
    );
  };


  $scope.postBadge = function (userId, badge) {
    BadgeFactory.postBadge(userId, badge);
  };

  $scope.postBadge(1, 2);
  $scope.postBadge(1, 3);

  // loads all badges that the user has earned so far
  $scope.getBadges();
  // loads all badges that hte user has not earned
  $scope.getPossibleBadges();

}]);

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

  $scope.newlogin = {};
  $scope.newlogin.userId = $scope.id;
  $scope.change = false;

  $scope.editLogin = function(){
    $scope.active = 'editLogin';
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

  $scope.updateLogin = function(){
    AccountFactory.editLogin($scope.newlogin)
      .then(function(user){
        if(user.data === "Wrong old password"){
          Materialize.toast('You entered the wrong old password!', 2000);
        }else if(user.data === "Email already taken"){
          Materialize.toast('New Email already taken, please use another Email.', 2000);
        }else{
          $scope.newlogin = {};
          $scope.cancel();
          Materialize.toast('Your login has been updated', 2000);
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

angular.module('app.botbar', [])

// TODO: likely change portofolio factory name to be more precise
.controller('BotBarController',['$scope', 'Portfolio', '$interval', function($scope, Portfolio, $interval){
  // Initializes variable if the user has not searched yet
  $scope.hasSearched = false;

  $scope.stockSearch = function () {
    var stockName = $scope.stockInput.toUpperCase();
    Portfolio.getStock(stockName).then(function(stock){
      if(!stock.Ask){
        Materialize.toast('Please enter valid symbol!', 3000);
      }
      else{
        $scope.stock = stock;
        $scope.hasSearched = true;
    }
    });
    $scope.stockInput = "";
  };

}]);

app.controller('ClockController', ['$scope', '$interval', function ($scope, $interval) {

  $scope.time;

  $scope.getCurrentTime = function () {
    var currentTime = moment().utc().subtract(7, 'hour');
    var warning = 'until stock market opens';
    var hour = currentTime.hour();
    var minute = currentTime.minute();
    var second = currentTime.second();
    second = 60 - second;

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

var app = angular.module('app')

app.controller('MainForumController', ['$scope', '$window', 'forumFactory', '$rootScope', '$location', '$anchorScroll','topicFactory', function($scope, $window, forumFactory, $rootScope, $location, $anchorScroll, topicFactory){

  $scope.sortLatest = 'createdAt';
  $scope.sortReverse = true;
  $scope.topic = {};
  $scope.topic.username = $window.localStorage.getItem('com.tp.username');
  $scope.topic.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.allTopics;

  $scope.openModal = function(){
    $('#createForumPost').openModal();
  };

  $scope.createTopic = function(topic){
    forumFactory.addNewTopic(topic).then(function(err, res){
      if(err){console.log(err)}
    }).then(function(){
      $scope.topic.title = '';
      $scope.topic.description = '';
      $('#createForumPost').closeModal();
      $scope.showAllTopics();
      $scope.goToTop();
    });
  };

  $scope.showAllTopics = function(){
    forumFactory.showAllTopics().then(function(data){
      $scope.allTopics = data.data;

      for(var i = 0; i < $scope.allTopics.length; i++){

        (function(index){
          $scope.allTopics[index].replies = 0;
          topicFactory.showAllReplies($scope.allTopics[index].id)
            .then(function(replies){
              console.log('#ofREPLIES: ', replies);
              $scope.allTopics[index].replies = replies.data.length;

            });
        })(i)
      }

    });
  };


  $scope.goToTop = function(){
    $location.hash('top');
    $anchorScroll();
  };

  $scope.showAllTopics();

}]);


var app = angular.module('app', ['ui.router', 'app.dashboard', 'app.portfolio', 'app.botbar', 'app.leagueResults', 'ngFileUpload', 'app.profile', 'angularCharts', 'ngSanitize']);


  app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      // .state('symbol', {
      //   url: '/symbol',
      //   controller: 'SymbolController',
      //   templateUrl: 'symbol/symbol.html'

      // })

      .state('signin', {
        url: '/',
        authenticate: true,
        controller: 'SigninController',
        controllerAs: 'signin',
        templateUrl: 'signin/signin.html'
      })

      .state('dashboard', {
        url: '/dashboard',
        authenticate: true,
        views: {
          '': {
            controller: 'DashboardController',
            controllerAs: 'dashboard',
            templateUrl: 'dashboard/dashboard.html'
          },
          'badge@dashboard': {
            controller: 'BadgeController',
            controllerAs: 'badge',
            templateUrl: 'badges/badge.html'
          },
        }


      })

      .state('forum', {
        url: '/forum',
        authenticate: true,
        controller: 'MainForumController',
        templateUrl: 'forum/main.html'
      })

      .state('topic', {
        url: '/topics/:topicId',
        authenticate: true,
        controller: 'TopicController',
        templateUrl: 'topic/topic.html'
      })

      .state('account', {
        url: '/account',
        authenticate: true,
        controller: 'AccountController',
        templateUrl: 'account/account.html'
      })

      .state('profiles', {
        url: '/profiles/:userId',
        authenticate: false,
        controller: 'ProfileController',
        templateUrl: 'profile/profile.html'
      })

      .state('league', {
        url: '/leagues/:leagueId',
        authenticate: true,
        views: {
          /*main view of the entire league template*/
          '': {
            templateUrl: 'league/league.html',
            controller: 'LeagueController'
          },

          'order@league': {
            controller: 'orderStatusController',
            templateUrl: 'orderStatus/orderStatus.html'
          },
          // portfolio view within the league page
          'portfolio@league': {
            controller: 'PortfolioController',
            controllerAs: 'portfolio',
            templateUrl: 'portfolio/portfolio.html'
          },
          // leaderboard view within league page
          'leaderboard@league': {
            controller: 'LeaderBoardController',
            controllerAs: 'leaderboard',
            templateUrl: 'leaderboard/leaderboard.html'
          },
          // news/analysis view within league page

          'news@league': {
            controller: 'NewsController',
            templateUrl: 'news/news.html'
          },

          'recentTransactions@league': {
            controller: 'recentTransactionsController',
            templateUrl: 'recentTransactions/recentTransactions.html'
          },

          'messageboard@league': {
            controller: 'MessageBoardController',
            templateUrl: 'messageboard/messageboard.html'
          },

          'leagueResults@league': {
            controller: 'LeagueResultsController',
            templateUrl: 'leagueResults/leagueResults.html'
          },
          'preleague@league': {
            controller: 'PreLeagueController',
            templateUrl: 'preleague/preleague.html'
          },
          'symbol@league':{
            controller: 'SymbolController',
            templateUrl: 'symbol/symbol.html'
          },
          'chart@league':{
            controller: 'PortfolioChartController',
            templateUrl: 'portfolioChart/portfolioChart.html'
          }
        }
      })

    $httpProvider.interceptors.push('AttachTokens');

  }]);

app.factory('AttachTokens', function($window) {
    // this is an $httpInterceptor
    // its job is to stop all out going request
    // then look in local storage and find the user's token
    // then add it to the header so the server can validate the request
    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('com.tp');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(function($rootScope, $location, Auth) {
    // here inside the run phase of angular, our services and controllers
    // have just been registered and our app is ready
    // however, we want to make sure the user is authorized
    // we listen for when angular is trying to change routes
    // when it does change routes, we then look for the token in localstorage
    // and send that token to the server to see if it is a real user or hasn't expired
    // if it's not valid, we then redirect back to signin/signup
    $rootScope.$on('$stateChangeStart', function(evt, next, current) {
      // if (next.$$state && next.$$state.authenticate && !Auth.isAuth()) {
      if (!Auth.isAuth()) {
        $location.path('/');
      }
    });
  });


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

  $scope.newlogin = {};
  $scope.newlogin.userId = $scope.id;
  $scope.change = false;

  $scope.editLogin = function(){
    $scope.active = 'editLogin';
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

  $scope.updateLogin = function(){
    AccountFactory.editLogin($scope.newlogin)
      .then(function(user){
        if(user.data === "Wrong old password"){
          Materialize.toast('You entered the wrong old password!', 2000);
        }else if(user.data === "Email already taken"){
          Materialize.toast('New Email already taken, please use another Email.', 2000);
        }else{
          $scope.newlogin = {};
          $scope.cancel();
          Materialize.toast('Your login has been updated', 2000);
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

app.controller('BadgeController', ['$scope', 'BadgeFactory', '$window', function($scope, BadgeFactory, $window){
  var userId = $window.localStorage.getItem('com.tp.userId');
  $scope.badges = [];
  $scope.possibleBadges = [];

  $scope.getBadges = function () {
    BadgeFactory.getBadges(userId).then(
      function (res) {
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.badges.push(badgeFormatted);
        });
      }
    );
  };

  $scope.getPossibleBadges = function () {
    BadgeFactory.getPossibleBadges(userId).then(
      function (res) {
        console.log(res);
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.possibleBadges.push(badgeFormatted);
        });
      }
    );
  };


  $scope.postBadge = function (userId, badge) {
    BadgeFactory.postBadge(userId, badge);
  };

  $scope.postBadge(1, 2);
  $scope.postBadge(1, 3);

  // loads all badges that the user has earned so far
  $scope.getBadges();
  // loads all badges that hte user has not earned
  $scope.getPossibleBadges();

  console.log(test);
}]);

angular.module('app.botbar', [])

// TODO: likely change portofolio factory name to be more precise
.controller('BotBarController',['$scope', 'Portfolio', '$interval', function($scope, Portfolio, $interval){
  // Initializes variable if the user has not searched yet
  $scope.hasSearched = false;

  $scope.stockSearch = function () {
    var stockName = $scope.stockInput.toUpperCase();
    Portfolio.getStock(stockName).then(function(stock){
      if(!stock.Ask){
        Materialize.toast('Please enter valid symbol!', 3000);
      }
      else{
        $scope.stock = stock;
        $scope.hasSearched = true;
    }
    });
    $scope.stockInput = "";
  };

}]);

app.controller('ClockController', ['$scope', '$interval', function ($scope, $interval) {

  $scope.time;

  $scope.getCurrentTime = function () {
    var currentTime = moment().utc().subtract(7, 'hour');
    var warning = 'until stock market opens';
    var hour = currentTime.hour();
    var minute = currentTime.minute();
    var second = currentTime.second();
    second = 60 - second;

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

  $scope.sortStart = 'start';
  $scope.sortEnd = 'endDate';
  $scope.sortReverse = false;


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
  };

  $scope.pickend = function(){
    var end = $('#enddate').pickadate({
      onSet: function (context) {
        $scope.league.end = new Date(context.select);
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
  };

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
    league.creatorId = creatorId;
    league.creatorName = creatorName;

    league.private = JSON.parse(league.isPrivate);
    DashboardFactory.addLeague(league)
      .then(function(league){
        $scope.toggleAdd();
        if (league.private === true){
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

        for(var i = 0; i < $scope.portfolios.length; i++){

          (function(index){
            $scope.portfolios[index].endDate = '';
            DashboardFactory.getLeagueById($scope.portfolios[index].id)
              .then(function(league){
                $scope.portfolios[index].endDate = league.end;
              })
          })(i)
        }

      })
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
  };

  $scope.notfull = function(league){
    if(league.maxNum - league.usersJoined > 0){
      return true;
    }
  }

  $scope.notstarted = function(league){
    var now = new Date();
    var convertedNow = moment.utc(now).format();
    var start = league.start;

    if(convertedNow <= start){
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
            return false;
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
  };

  $scope.getUserLeagues();
  $scope.getLeaguesToJoin();

}]);


var app = angular.module('app', ['ui.router', 'app.dashboard', 'app.portfolio', 'app.botbar', 'app.leagueResults', 'ngFileUpload', 'app.profile', 'angularCharts', 'ngSanitize']);


  app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      // .state('symbol', {
      //   url: '/symbol',
      //   controller: 'SymbolController',
      //   templateUrl: 'symbol/symbol.html'

      // })

      .state('signin', {
        url: '/',
        authenticate: true,
        controller: 'SigninController',
        controllerAs: 'signin',
        templateUrl: 'signin/signin.html'
      })

      .state('dashboard', {
        url: '/dashboard',
        authenticate: true,
        views: {
          '': {
            controller: 'DashboardController',
            controllerAs: 'dashboard',
            templateUrl: 'dashboard/dashboard.html'
          },
          'badge@dashboard': {
            controller: 'BadgeController',
            controllerAs: 'badge',
            templateUrl: 'badges/badge.html'
          },
        }


      })

      .state('forum', {
        url: '/forum',
        authenticate: true,
        controller: 'MainForumController',
        templateUrl: 'forum/main.html'
      })

      .state('topic', {
        url: '/topics/:topicId',
        authenticate: true,
        controller: 'TopicController',
        templateUrl: 'topic/topic.html'
      })

      .state('account', {
        url: '/account',
        authenticate: true,
        controller: 'AccountController',
        templateUrl: 'account/account.html'
      })

      .state('profiles', {
        url: '/profiles/:userId',
        authenticate: false,
        controller: 'ProfileController',
        templateUrl: 'profile/profile.html'
      })

      .state('league', {
        url: '/leagues/:leagueId',
        authenticate: true,
        views: {
          /*main view of the entire league template*/
          '': {
            templateUrl: 'league/league.html',
            controller: 'LeagueController'
          },

          'order@league': {
            controller: 'orderStatusController',
            templateUrl: 'orderStatus/orderStatus.html'
          },
          // portfolio view within the league page
          'portfolio@league': {
            controller: 'PortfolioController',
            controllerAs: 'portfolio',
            templateUrl: 'portfolio/portfolio.html'
          },
          // leaderboard view within league page
          'leaderboard@league': {
            controller: 'LeaderBoardController',
            controllerAs: 'leaderboard',
            templateUrl: 'leaderboard/leaderboard.html'
          },
          // news/analysis view within league page

          'news@league': {
            controller: 'NewsController',
            templateUrl: 'news/news.html'
          },

          'recentTransactions@league': {
            controller: 'recentTransactionsController',
            templateUrl: 'recentTransactions/recentTransactions.html'
          },

          'messageboard@league': {
            controller: 'MessageBoardController',
            templateUrl: 'messageboard/messageboard.html'
          },

          'leagueResults@league': {
            controller: 'LeagueResultsController',
            templateUrl: 'leagueResults/leagueResults.html'
          },
          'preleague@league': {
            controller: 'PreLeagueController',
            templateUrl: 'preleague/preleague.html'
          },
          'symbol@league':{
            controller: 'SymbolController',
            templateUrl: 'symbol/symbol.html'
          },
          'chart@league':{
            controller: 'PortfolioChartController',
            templateUrl: 'portfolioChart/portfolioChart.html'
          }
        }
      })

    $httpProvider.interceptors.push('AttachTokens');

  }]);

app.factory('AttachTokens', function($window) {
    // this is an $httpInterceptor
    // its job is to stop all out going request
    // then look in local storage and find the user's token
    // then add it to the header so the server can validate the request
    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('com.tp');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(function($rootScope, $location, Auth) {
    // here inside the run phase of angular, our services and controllers
    // have just been registered and our app is ready
    // however, we want to make sure the user is authorized
    // we listen for when angular is trying to change routes
    // when it does change routes, we then look for the token in localstorage
    // and send that token to the server to see if it is a real user or hasn't expired
    // if it's not valid, we then redirect back to signin/signup
    $rootScope.$on('$stateChangeStart', function(evt, next, current) {
      // if (next.$$state && next.$$state.authenticate && !Auth.isAuth()) {
      if (!Auth.isAuth()) {
        $location.path('/');
      }
    });
  });


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

  $scope.newlogin = {};
  $scope.newlogin.userId = $scope.id;
  $scope.change = false;

  $scope.editLogin = function(){
    $scope.active = 'editLogin';
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

  $scope.updateLogin = function(){
    AccountFactory.editLogin($scope.newlogin)
      .then(function(user){
        if(user.data === "Wrong old password"){
          Materialize.toast('You entered the wrong old password!', 2000);
        }else if(user.data === "Email already taken"){
          Materialize.toast('New Email already taken, please use another Email.', 2000);
        }else{
          $scope.newlogin = {};
          $scope.cancel();
          Materialize.toast('Your login has been updated', 2000);
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

app.controller('BadgeController', ['$scope', 'BadgeFactory', '$window', function($scope, BadgeFactory, $window){
  var userId = $window.localStorage.getItem('com.tp.userId');
  $scope.badges = [];
  $scope.possibleBadges = [];

  $scope.getBadges = function () {
    BadgeFactory.getBadges(userId).then(
      function (res) {
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.badges.push(badgeFormatted);
        });
      }
    );
  };

  $scope.getPossibleBadges = function () {
    BadgeFactory.getPossibleBadges(userId).then(
      function (res) {
        console.log(res);
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.possibleBadges.push(badgeFormatted);
        });
      }
    );
  };


  $scope.postBadge = function (userId, badge) {
    BadgeFactory.postBadge(userId, badge);
  };

  $scope.postBadge(1, 2);
  $scope.postBadge(1, 3);

  // loads all badges that the user has earned so far
  $scope.getBadges();
  // loads all badges that hte user has not earned
  $scope.getPossibleBadges();

  console.log(test);
}]);

angular.module('app.botbar', [])

// TODO: likely change portofolio factory name to be more precise
.controller('BotBarController',['$scope', 'Portfolio', '$interval', function($scope, Portfolio, $interval){
  // Initializes variable if the user has not searched yet
  $scope.hasSearched = false;

  $scope.stockSearch = function () {
    var stockName = $scope.stockInput.toUpperCase();
    Portfolio.getStock(stockName).then(function(stock){
      if(!stock.Ask){
        Materialize.toast('Please enter valid symbol!', 3000);
      }
      else{
        $scope.stock = stock;
        $scope.hasSearched = true;
    }
    });
    $scope.stockInput = "";
  };

}]);

app.controller('ClockController', ['$scope', '$interval', function ($scope, $interval) {

  $scope.time;

  $scope.getCurrentTime = function () {
    var currentTime = moment().utc().subtract(7, 'hour');
    var warning = 'until stock market opens';
    var hour = currentTime.hour();
    var minute = currentTime.minute();
    var second = currentTime.second();
    second = 60 - second;

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

  $scope.sortStart = 'start';
  $scope.sortEnd = 'endDate';
  $scope.sortReverse = false;


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
  };

  $scope.pickend = function(){
    var end = $('#enddate').pickadate({
      onSet: function (context) {
        $scope.league.end = new Date(context.select);
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
  };

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
    league.creatorId = creatorId;
    league.creatorName = creatorName;

    league.private = JSON.parse(league.isPrivate);
    DashboardFactory.addLeague(league)
      .then(function(league){
        $scope.toggleAdd();
        if (league.private === true){
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

        for(var i = 0; i < $scope.portfolios.length; i++){

          (function(index){
            $scope.portfolios[index].endDate = '';
            DashboardFactory.getLeagueById($scope.portfolios[index].id)
              .then(function(league){
                $scope.portfolios[index].endDate = league.end;
              })
          })(i)
        }

      })
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
  };

  $scope.notfull = function(league){
    if(league.maxNum - league.usersJoined > 0){
      return true;
    }
  }

  $scope.notstarted = function(league){
    var now = new Date();
    var convertedNow = moment.utc(now).format();
    var start = league.start;

    if(convertedNow <= start){
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
            return false;
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
  };

  $scope.getUserLeagues();
  $scope.getLeaguesToJoin();

}]);


var app = angular.module('app', ['ui.router', 'app.dashboard', 'app.portfolio', 'app.botbar', 'app.leagueResults', 'ngFileUpload', 'app.profile', 'angularCharts', 'ngSanitize']);


  app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      // .state('symbol', {
      //   url: '/symbol',
      //   controller: 'SymbolController',
      //   templateUrl: 'symbol/symbol.html'

      // })

      .state('signin', {
        url: '/',
        authenticate: true,
        controller: 'SigninController',
        controllerAs: 'signin',
        templateUrl: 'signin/signin.html'
      })

      .state('dashboard', {
        url: '/dashboard',
        authenticate: true,
        views: {
          '': {
            controller: 'DashboardController',
            controllerAs: 'dashboard',
            templateUrl: 'dashboard/dashboard.html'
          },
          'badge@dashboard': {
            controller: 'BadgeController',
            controllerAs: 'badge',
            templateUrl: 'badges/badge.html'
          },
        }


      })

      .state('forum', {
        url: '/forum',
        authenticate: true,
        controller: 'MainForumController',
        templateUrl: 'forum/main.html'
      })

      .state('topic', {
        url: '/topics/:topicId',
        authenticate: true,
        controller: 'TopicController',
        templateUrl: 'topic/topic.html'
      })

      .state('account', {
        url: '/account',
        authenticate: true,
        controller: 'AccountController',
        templateUrl: 'account/account.html'
      })

      .state('profiles', {
        url: '/profiles/:userId',
        authenticate: false,
        controller: 'ProfileController',
        templateUrl: 'profile/profile.html'
      })

      .state('league', {
        url: '/leagues/:leagueId',
        authenticate: true,
        views: {
          /*main view of the entire league template*/
          '': {
            templateUrl: 'league/league.html',
            controller: 'LeagueController'
          },

          'order@league': {
            controller: 'orderStatusController',
            templateUrl: 'orderStatus/orderStatus.html'
          },
          // portfolio view within the league page
          'portfolio@league': {
            controller: 'PortfolioController',
            controllerAs: 'portfolio',
            templateUrl: 'portfolio/portfolio.html'
          },
          // leaderboard view within league page
          'leaderboard@league': {
            controller: 'LeaderBoardController',
            controllerAs: 'leaderboard',
            templateUrl: 'leaderboard/leaderboard.html'
          },
          // news/analysis view within league page

          'news@league': {
            controller: 'NewsController',
            templateUrl: 'news/news.html'
          },

          'recentTransactions@league': {
            controller: 'recentTransactionsController',
            templateUrl: 'recentTransactions/recentTransactions.html'
          },

          'messageboard@league': {
            controller: 'MessageBoardController',
            templateUrl: 'messageboard/messageboard.html'
          },

          'leagueResults@league': {
            controller: 'LeagueResultsController',
            templateUrl: 'leagueResults/leagueResults.html'
          },
          'preleague@league': {
            controller: 'PreLeagueController',
            templateUrl: 'preleague/preleague.html'
          },
          'symbol@league':{
            controller: 'SymbolController',
            templateUrl: 'symbol/symbol.html'
          },
          'chart@league':{
            controller: 'PortfolioChartController',
            templateUrl: 'portfolioChart/portfolioChart.html'
          }
        }
      })

    $httpProvider.interceptors.push('AttachTokens');

  }]);

app.factory('AttachTokens', function($window) {
    // this is an $httpInterceptor
    // its job is to stop all out going request
    // then look in local storage and find the user's token
    // then add it to the header so the server can validate the request
    var attach = {
      request: function(object) {
        var jwt = $window.localStorage.getItem('com.tp');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(function($rootScope, $location, Auth) {
    // here inside the run phase of angular, our services and controllers
    // have just been registered and our app is ready
    // however, we want to make sure the user is authorized
    // we listen for when angular is trying to change routes
    // when it does change routes, we then look for the token in localstorage
    // and send that token to the server to see if it is a real user or hasn't expired
    // if it's not valid, we then redirect back to signin/signup
    $rootScope.$on('$stateChangeStart', function(evt, next, current) {
      // if (next.$$state && next.$$state.authenticate && !Auth.isAuth()) {
      if (!Auth.isAuth()) {
        $location.path('/');
      }
    });
  });


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

  $scope.newlogin = {};
  $scope.newlogin.userId = $scope.id;
  $scope.change = false;

  $scope.editLogin = function(){
    $scope.active = 'editLogin';
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

  $scope.updateLogin = function(){
    AccountFactory.editLogin($scope.newlogin)
      .then(function(user){
        if(user.data === "Wrong old password"){
          Materialize.toast('You entered the wrong old password!', 2000);
        }else if(user.data === "Email already taken"){
          Materialize.toast('New Email already taken, please use another Email.', 2000);
        }else{
          $scope.newlogin = {};
          $scope.cancel();
          Materialize.toast('Your login has been updated', 2000);
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

app.controller('BadgeController', ['$scope', 'BadgeFactory', '$window', function($scope, BadgeFactory, $window){
  var userId = $window.localStorage.getItem('com.tp.userId');
  $scope.badges = [];
  $scope.possibleBadges = [];

  $scope.getBadges = function () {
    BadgeFactory.getBadges(userId).then(
      function (res) {
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.badges.push(badgeFormatted);
        });
      }
    );
  };

  $scope.getPossibleBadges = function () {
    BadgeFactory.getPossibleBadges(userId).then(
      function (res) {
        console.log(res);
        res.data.forEach(function (badge) {
          var badgeFormatted = {};
          badgeFormatted.name = badge.name;
          badgeFormatted.text = badge.text;
          badgeFormatted.icon = badge.icon;
          $scope.possibleBadges.push(badgeFormatted);
        });
      }
    );
  };


  $scope.postBadge = function (userId, badge) {
    BadgeFactory.postBadge(userId, badge);
  };

  $scope.postBadge(1, 2);
  $scope.postBadge(1, 3);

  // loads all badges that the user has earned so far
  $scope.getBadges();
  // loads all badges that hte user has not earned
  $scope.getPossibleBadges();
}]);

angular.module('app.botbar', [])

// TODO: likely change portofolio factory name to be more precise
.controller('BotBarController',['$scope', 'Portfolio', '$interval', function($scope, Portfolio, $interval){
  // Initializes variable if the user has not searched yet
  $scope.hasSearched = false;

  $scope.stockSearch = function () {
    var stockName = $scope.stockInput.toUpperCase();
    Portfolio.getStock(stockName).then(function(stock){
      if(!stock.Ask){
        Materialize.toast('Please enter valid symbol!', 3000);
      }
      else{
        $scope.stock = stock;
        $scope.hasSearched = true;
    }
    });
    $scope.stockInput = "";
  };

}]);

app.controller('ClockController', ['$scope', '$interval', function ($scope, $interval) {

  $scope.time;

  $scope.getCurrentTime = function () {
    var currentTime = moment().utc().subtract(7, 'hour');
    var warning = 'until stock market opens';
    var hour = currentTime.hour();
    var minute = currentTime.minute();
    var second = currentTime.second();
    second = 60 - second;

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

  $scope.sortStart = 'start';
  $scope.sortEnd = 'endDate';
  $scope.sortReverse = false;


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
  };

  $scope.pickend = function(){
    var end = $('#enddate').pickadate({
      onSet: function (context) {
        $scope.league.end = new Date(context.select);
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
  };

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
    league.creatorId = creatorId;
    league.creatorName = creatorName;

    league.private = JSON.parse(league.isPrivate);
    DashboardFactory.addLeague(league)
      .then(function(league){
        $scope.toggleAdd();
        if (league.private === true){
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

        for(var i = 0; i < $scope.portfolios.length; i++){

          (function(index){
            $scope.portfolios[index].endDate = '';
            DashboardFactory.getLeagueById($scope.portfolios[index].id)
              .then(function(league){
                $scope.portfolios[index].endDate = league.end;
              })
          })(i)
        }

      })
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
  };

  $scope.notfull = function(league){
    if(league.maxNum - league.usersJoined > 0){
      return true;
    }
  }

  $scope.notstarted = function(league){
    var now = new Date();
    var convertedNow = moment.utc(now).format();
    var start = league.start;

    if(convertedNow <= start){
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
            return false;
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
  };

  $scope.getUserLeagues();
  $scope.getLeaguesToJoin();

}]);

app.controller('FaqsController', function(){



});
var app = angular.module('app')

app.controller('MainForumController', ['$scope', '$window', 'forumFactory', '$rootScope', '$location', '$anchorScroll','topicFactory', function($scope, $window, forumFactory, $rootScope, $location, $anchorScroll, topicFactory){

  $scope.sortLatest = 'createdAt';
  $scope.sortReverse = true;
  $scope.topic = {};
  $scope.topic.username = $window.localStorage.getItem('com.tp.username');
  $scope.topic.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.allTopics;

  $scope.openModal = function(){
    $('#createForumPost').openModal();
  };

  $scope.createTopic = function(topic){
    forumFactory.addNewTopic(topic).then(function(err, res){
      if(err){console.log(err)}
    }).then(function(){
      $scope.topic.title = '';
      $scope.topic.description = '';
      $('#createForumPost').closeModal();
      $scope.showAllTopics();
      $scope.goToTop();
    });
  };

  $scope.showAllTopics = function(){
    forumFactory.showAllTopics().then(function(data){
      $scope.allTopics = data.data;

      for(var i = 0; i < $scope.allTopics.length; i++){

        (function(index){
          $scope.allTopics[index].replies = 0;
          topicFactory.showAllReplies($scope.allTopics[index].id)
            .then(function(replies){
              console.log('#ofREPLIES: ', replies);
              $scope.allTopics[index].replies = replies.data.length;

            });
        })(i)
      }

    });
  };


  $scope.goToTop = function(){
    $location.hash('top');
    $anchorScroll();
  };

  $scope.showAllTopics();

}]);

  // $(document).ready(function(){

  // 	setTimeout(function(){
	 //    console.log(document.getElementById('widget-container'))
	 //    $('#widget-container').html('<script type="text/javascript" src="https://www.barchart.com/widget.js?uid=7a89c27aa42a40916668fe0d82edec22&widgetType=leaders&lbType=stock&widgetWidth=300&fontColor%5Blinks%5D=004376&font=1&tabs%5B%5D=active&tabs%5B%5D=gainers&tabs%5B%5D=losers&symbox=1&fields%5B%5D=name&fields%5B%5D=symbol&fields%5B%5D=last&fields%5B%5D=pctchange&displayChars="></script>');
	 //    // $('.widget-container').write('hey');
	 //  }, 2000);

  // });
app.controller('LeaderBoardController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'leaderBoardFactory', '$location', '$rootScope' ,function($scope, $window, $stateParams, DashboardFactory, leaderBoardFactory, $location, $rootScope){

  // members will be an object of each member in the league
  // containing name, portfolio value, and other stats
  // desired to go on the leaderboard
  $scope.members = [
    {
      username: 'Sonny',
      value: 15000,
      return: '10%',
      transactions: 25
    },
    {
      username: 'Ted',
      value: 9000,
      return: '20%',
      transactions: 45
    },
    {
      username: 'Devonte',
      value: 3567,
      return: '6%',
      transactions: 5
    }
  ];

  $scope.leagueId = $stateParams.leagueId;
  $scope.portfolios;
  $scope.leagueName;

  $scope.getLeaderBoard = function(){
    // this will call a factory function to grab http data from server and assign returned data to $scope.members;
    leaderBoardFactory.getPortfolios($scope.leagueId)
      .then(function(portfolios){
        var userId = $window.localStorage.getItem('com.tp.userId');
        var joined = false;
        for(var i=0; i<portfolios.length; i++){
          if(portfolios[i].UserId === Number(userId)) joined = true;
        }
        $scope.portfolios = portfolios;
        $scope.leagueName = portfolios[0].leaguename;
        $scope.code = portfolios[0].code;
        if(!joined) {
          $window.location.href = '/#/dashboard';
          Materialize.toast('You are not in the league.',1000);
        }
      });
  };

  $scope.getLeagueById = function(){
    DashboardFactory.getLeagueById($scope.leagueId).then(function(data){
      $scope.secretCode = data.code;
    });
  };

  $scope.getLeagueById();
  $scope.getLeaderBoard();
  // once we have league ID, call to initialize leaderboard
  //$scope.getLeaderBoard(leagueId);
  $rootScope.$on("PortfolioUpdate", function(){
    $scope.getLeaderBoard();
  });
}]);

app.controller('LeagueController', ['$scope', '$stateParams', 'DashboardFactory', function($scope, $stateParams, DashboardFactory){
  //Gets the league
  var leagueId = $stateParams.leagueId;

  // initialize a flag indicating that the league has not started yet
  $scope.hasStarted = false;
  $scope.hasEnded = false;
  // grab the current moment using moment.js
  var currentMoment = moment().utc();

  $scope.checkStart = function (league) {
    var start = moment(league.start).utc();
    if (currentMoment.isBefore(start)) {
      $scope.hasStarted = false;
    } else {
      $scope.hasStarted = true;
      // TODO: add this to the databse
    }
  };

  $scope.checkEnd = function (league) {
    var end = moment(league.end).utc();
    if (currentMoment.isAfter(end)) {
      $scope.hasEnded = true;
    } else {
      $scope.hasEnded = false;
      // TODO: add this to the databse
    }
  };

  $scope.checkTradingHours = function () {
    var tradingStart = moment().utc().hour(13).minute(30);
    var tradingEnd = moment().utc().hour(20);
    $scope.isBetweenTradingHours = currentMoment.isBetween(tradingStart, tradingEnd);
  };

  DashboardFactory.getLeagueById(leagueId)
    .then(function(league){
      $scope.league = league;
      // TODO: make this run conditionally
      // if (league.hasStarted === false ) {
      //   run the checkStart
      // }
      $scope.checkStart($scope.league);
      $scope.checkEnd($scope.league);
      if ($scope.hasStarted || !$scope.hasEnded) {
        $scope.checkTradingHours();
      }
    });


}]);

var app = angular.module('app');

app.controller('MessageBoardController', function($scope, messageBoardFactory, $rootScope, $window, $stateParams){

  $scope.posts;

  $scope.userPost = {};
  $scope.userPost.name = $window.localStorage.getItem('com.tp.username');
  $scope.userPost.leagueId = $stateParams.leagueId;

  $scope.messageBoardPost = function(){

    messageBoardFactory.submitPost($scope.userPost).then(function(){

      messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
        var posts = posts;
        $scope.posts = posts.data;
        console.log(posts);
        $scope.userPost.message = '';
        $rootScope.$emit('scrollDown');
      });

    });
  };

  $scope.leagueId;


  var showPosts = function(){
    messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
    var posts = posts;
    $scope.posts = posts.data;
  });
};

  showPosts();
  // $window.setInterval(showPosts, 1000);

});

angular.module('app.leagueResults', [])

.controller('LeagueResultsController', function($scope, $stateParams, $window, leaderBoardFactory, DashboardFactory, Portfolio){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');

  // Getting the winner of the league
  leaderBoardFactory.getPortfolios(leagueId)
    .then(function(portfolios){
			var max = 0, winner;
			portfolios.forEach(function(portfolio){
				if (portfolio.balance + portfolio.portfolioValue > max){
					max = portfolio.balance + portfolio.portfolioValue;
					winner = portfolio;
				}
			});

			$scope.winner = winner;
   	});

  // Getting the current league
  DashboardFactory.getLeagueById(leagueId)
  	.then(function(league){
  		$scope.league = league;
  	});

  //Getting user stocks
  //updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions;

			var mostShares = 0 , mostStockShares;
			transactions.forEach(function(transaction){
				if (transaction.shares > mostShares){
					mostShares = transaction.shares;
					mostStockShares = transaction;
				}
			});
			$scope.mostShares = mostStockShares;
		});

});

app.controller('NewsController', ['$scope', '$window', '$stateParams', 'News', function($scope, $window, $stateParams, News){


  $scope.tweets = [];

  $scope.getTweets= function(){

    var leagueId = $stateParams.leagueId;
    var userId = $window.localStorage.getItem('com.tp.userId');
    $scope.tweets = [];
    News.getNews(userId, leagueId)
    .then(function (res){
      res.data.forEach(function(tweet){
        $scope.tweets.push({text : tweet.text, user : tweet.user, time: tweet.created_at});
      });

    });
  };
  //$scope.getTweets();
}]);

app.controller('orderStatusController', ['$scope', '$window', '$stateParams', 'orderStatusFactory', function($scope, $window, $stateParams, orderStatusFactory){

  $scope.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.leagueId = $stateParams.leagueId;

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

  $scope.openModal = function(){
    $('#modal2').openModal();
  };

  $scope.closeModal = function(){
    $('#modal2').closeModal();
  };

}]);

angular.module('app.portfolio', [])

.controller('PortfolioController', ['$scope', '$window', '$stateParams', 'Portfolio', '$rootScope', function($scope, $window, $stateParams, Portfolio, $rootScope){
	// MAKE A TRADE MODAL
	$scope.leagueId = $stateParams.leagueId;
	$scope.userId = $window.localStorage.getItem('com.tp.userId');
	$scope.fees = 10;
	$scope.estPrice = 0;
	$scope.action = false;
	$scope.singlePrice = 0;

	$rootScope.$on('symbolRetrieved', function(event, data){
		return $scope.chooseStock(data);
	});

	$scope.resetFields = function (){
		$scope.stock = undefined;
		$scope.stockAmount = '';
		$scope.stockInput = '';
		$scope.estPrice = '';
		$scope.singlePrice = '';
		$scope.total = '';
	};

	$scope.chooseStock = function(stockName){
		Portfolio.getStock(stockName).then(function(stock){
			if(!stock.Ask){
				Materialize.toast('Please enter a valid symbol!',3000);
			}
			else {
			$scope.stock = stock;
			$scope.estPrice = stock.Ask;
			$scope.singlePrice = stock.Ask;
		}
		});
		$scope.resetFields();
	};

	// Either buys a stock or sells it depending on selection
	$scope.performAction = function(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');
		var options = {
			symbol: $scope.stock.symbol,
			company: $scope.stock.Name,
			leagueId: leagueId,
			userId:  userId,
			shares: $scope.stockAmount,
			price: $scope.stock.Ask,
			marketPrice: $scope.stock.Ask,
			buysell: !$scope.action
		};
		// if selling stock, must own it and enough shares
		if (!options.buysell && !ableToSell()){
			return false;
		} else if (options.buysell && $scope.total > $scope.balance){
			Materialize.toast("Your balance isn't high enough to make this trade", 3000, 'rounded');
			return false;
		} else if (options.buysell && Number($scope.singlePrice) < Number($scope.stock.Ask)){
			options.price = $scope.singlePrice;
			options.executed = false;
			Portfolio.limitOrder(options).then(function(data){
			});
			Materialize.toast("Your limit order has been placed", 3000, 'rounded');
			$scope.resetFields();
			return false;
		} else {
			options.executed = true;
			Portfolio.limitOrder(options).then(function(data){
			});
			Portfolio.buySell(options).then(function(data){
				Materialize.toast('You traded '+options.shares+' shares in '+options.company, 3000, 'rounded');
				$scope.resetFields();
				updatePortfolio();
			});
		}
	};

	function ableToSell(){
		for (var i = 0; i < $scope.stocks.length; i++){
			if ($scope.stocks[i].symbol === $scope.stock.symbol){
				if ($scope.stockAmount <= $scope.stocks[i].shares){
					return true;
				} else {
					Materialize.toast('You are selling more shares in this company than you own', 3000, 'rounded');
					return false;
				}
			}
		}
		Materialize.toast('You do not own this share to sell', 3000, 'rounded');
		return false;
	}

	$scope.sellStock = function(stock){
    $scope.chooseStock(stock.symbol);
    $scope.action = true;

		//animation to scroll
		$('html, body').animate({
        scrollTop: $(".make-trades").offset().top
    }, 1500);
	};

	$scope.updateAmounts = function(){
		$scope.estPrice = $scope.stockAmount * $scope.singlePrice;
		$scope.total = $scope.estPrice + $scope.fees;
	};

	$scope.updateMarketPrice = function(){
			if ($scope.stocks.length > 0){
				Portfolio.updateUserStocks($scope.leagueId, $scope.userId).then(function(stocks){

				  if (stocks.error){
				  	Materialize.toast('Error updating market prices. Try again in a 30 seconds.', 5000, 'rounded');
				  } else {
				  	Materialize.toast('Market Price Updated', 3000, 'rounded');
				  	updatePortfolio();
				  }
				});
			}
		};

	// MY STOCKS MODAL
	updatePortfolio();
	// $scope.updateMarketPrice();

	function updatePortfolio(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');


		//updating user balance
		Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
		});

		//updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions;
            transactions.forEach(function(transaction){
              console.log(Math.round((transaction.marketPrice*transaction.shares)/$scope.portfolioValue*100),'&&&');
              transaction.percentage = Math.round((transaction.marketPrice*transaction.shares)/$scope.portfolioValue*100);
            });
			$scope.stocks = transactions;
		});



    $rootScope.$emit("PortfolioUpdate", {});
	}
}]);

app.controller('PortfolioChartController', ['$scope', 'Portfolio', '$stateParams', '$window', function($scope, Portfolio,$stateParams,$window){

$scope.data1 = {
		series: ['yo', 'yo1'],
		data: [{
			x: "Cash",
			y: [50],
			//tooltip: "this is tooltip"
		},
		{
			x:'Stocks',
			y:[50],
		}]
	};
	$scope.chartType = 'pie';

	$scope.config1 = {
		labels: true,
		click: function(d) {
			$scope.getBalance();
			Materialize.toast('Assets Updated!', 1000);
		},
		title: "Asset Allocation",
		legend: {
			display: true,
			position: 'right'
		},
		colors: ['#6baed6','#9ecae1'],
		innerRadius: 0
	};


$scope.getBalance = function (){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');
    Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
			$scope.total = $scope.balance + $scope.portfolioValue;
			$scope.data1.data[0].y[0]=(Math.round($scope.balance/$scope.total*100));
			$scope.data1.data[1].y[0]=(Math.round($scope.portfolioValue/$scope.total*100));
		});

};
$scope.getBalance();

}]);

app.controller('PreLeagueController', ['$scope', '$stateParams', 'preLeagueFactory', function($scope, $stateParams, preLeagueFactory){

  $scope.leagueId = $stateParams.leagueId;
  $scope.leagueName;

  $scope.getLeagueName = function(){
    preLeagueFactory.getName($scope.leagueId)
      .then(function(name){
        $scope.leagueName = name;
      });
  };

  $scope.pre = false;
  $scope.suspended = true;

  $scope.getLeagueName();

  // this is the start date, time of the league
  $scope.date;


}]);

angular.module('app.profile', [])

.controller('ProfileController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'AccountFactory', function($scope, $window, $stateParams, DashboardFactory, AccountFactory){
	$scope.id = $stateParams.userId;
	$scope.username = $window.localStorage.getItem('com.tp.username');

	$scope.getUserLeagues = function () {
    DashboardFactory.getUserLeagues($scope.id)
      .then(function(portfolios){
        $scope.portfolios = portfolios;
      });
  };

  $scope.getLeaguesByOwnerId = function(){
    AccountFactory.getLeaguesByOwnerId($scope.id).then(function(data){
      $scope.leagues = data;
      console.log('leagues created', data);
    });
  };

  // This functions needs to be created
  $scope.getLeaguesWonById = function(){

  	$scope.leaguesWon = [];
  };

  $scope.getUser = function(){
    AccountFactory.getSingleUser($scope.id)
      .then(function(user){
        $scope.user = user;
        $scope.email = user.email;
        $scope.image = user.image || '../assets/img/no-avatar.png';
      });
  };

  $scope.getUser();

  $scope.getLeaguesWonById();
  $scope.getLeaguesByOwnerId();
  $scope.getUserLeagues();
}]);

var app = angular.module('app')

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})

.filter('negative', function () {
   return function (items) {
    if(items <1){
      return Math.abs(items);
    }
    else{
      return Math.abs(items);
    }
  };
})

.controller('recentTransactionsController', ['$scope', 'transactionFactory', '$stateParams', 'leaderBoardFactory', function ($scope, transactionFactory, $stateParams, leaderBoardFactory) {

  var leagueId = $stateParams.leagueId;

  $scope.portfolios =[];
  $scope.transactions = [];
  $scope.usernames = {};

  $scope.getleagueTransactions = function (arr) {
    	  $scope.transactions =[];
        transactionFactory.getleagueTransactions(arr)
        .then(function (transactions){

        		angular.forEach(transactions.data, function (transaction){

        			for(var k in $scope.usernames){
        				if(parseInt(k) === transaction.portfolioid){
        					transaction.portfolioid = $scope.usernames[k];
        				}
        			}
        			$scope.transactions.push(transaction);
        		});
        });
  };
  $scope.getPortfolios = function () {
  	leaderBoardFactory.getPortfolios(leagueId)
  	  .then(function (portfolios) {
  	  	portfolios.forEach(function (portfolio) {
  	  		var id = portfolio.id;
  	  		$scope.usernames[portfolio.id]= portfolio.username;
  	  		$scope.portfolios.push({'PortfolioId': portfolio.id});
  	  	});
        $scope.getleagueTransactions($scope.portfolios);
  	  });
  };
}]);

app

  .factory('AccountFactory', function($http){

    var deleteAccount = function(userID){
      return $http({
        method: 'DELETE',
        url: 'api/users/',
        data: {id: userID},
        headers: {"Content-Type": "application/json;charset=utf-8"}
      })
      .then(function(user){
        console.log(user + ', successfully deleted');
      });
    };

    var editLogin = function(user){
      console.log(user.userId)
      return $http.put('api/users/'+user.userId, {
          id: user.userId,
          email: user.email,
          password: user.pass,
          oldpassword: user.oldpass
        }
      )
      .then(function(user){
        return user;
      })
    };

    var getSingleUser = function(userID){
      return $http({
        method: 'POST',
        url: 'api/users/getuser',
        data: {id: userID},
      })
      .then(function(user){
        return user.data;
      });
    };


    var getLeaguesByOwnerId = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/owner/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    var editOneLeague = function(id, data){
      return $http({
        method: 'PUT',
        url: '/api/leagues/'+id,
        data: data
      })
      .then(function(league){

      });
    }

    var deleteLeagueById = function(id, data){
      return $http({
        method: 'DELETE',
        url: '/api/leagues/'+id
      })
      .then(function(data){
        console.log(data);
      });
    }

    var profileImage = function(data){
      console.log(data);
      return $http({
        method: 'POST',
        url: 'api/users/profileimage',
        data: data,
      })
      .then(function(user){
        return user.data;
      });
    }

    return {
      deleteAccount: deleteAccount,
      editLogin: editLogin,
      getSingleUser: getSingleUser,
      getLeaguesByOwnerId: getLeaguesByOwnerId,
      editOneLeague: editOneLeague,
      deleteLeagueById: deleteLeagueById,
      getSingleUser: getSingleUser,
      profileImage: profileImage
    };

  })
app.factory('Auth', function($http, $location, $window){

  var createuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    })
    .then(function(data){
      return data.data;
    });
  };

  var loginuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function(data){
      return data.data;
    })
  }

  var isAuth = function() {
    return !!$window.localStorage.getItem('com.tp');
  };

  return {
    isAuth: isAuth,
    createuser: createuser,
    loginuser: loginuser
  };

});
app
  .factory('BadgeFactory', ['$http', function ($http) {
    var getBadges = function(userId){
      return $http({
        method: 'POST',
        url: '/api/badges/getBadges',
        data: {userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };
    var getPossibleBadges = function(userId){
      return $http({
        method: 'POST',
        url: '/api/badges/possibleBadges',
        data: {userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    var postBadge = function(userId, badge){
      return $http({
        method: 'POST',
        url: '/api/badges',
        data: {badge: badge, userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    return {
      getBadges: getBadges,
      getPossibleBadges: getPossibleBadges,
      postBadge: postBadge
    };
  }]);

app

  .factory('DashboardFactory', function($http){

    var addLeague = function(league){
      return $http({
        method: 'POST',
        url: '/api/leagues',
        data: league
      })
      .then( function(league){
        return league.data;
      });
    };

    var joinLeague = function(leagueId, userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/joinleague',
        data: { leagueId: leagueId,
                userId: userId }
      })
      .then( function(data){
        return data;
      });
    };

    var getUserLeagues = function(userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/userleague',
        data: {userId: userId}
      })
      .then( function (portfolios) {
        // TODO: Structure this appropriately once you have the exact route
        return portfolios.data;
      }
      );
    };

    var getAvailLeagues = function(){
      return $http({
        method: 'GET',
        url: '/api/leagues/'
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    };

    var getLeagueById = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    var getPortfolios = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: leagueID}
      })
      .then(function(portfolios){
        return portfolios.data;
      });
    };

    return {
      addLeague: addLeague,
      getUserLeagues: getUserLeagues,
      getAvailLeagues: getAvailLeagues,
      joinLeague: joinLeague,
      getLeagueById: getLeagueById,
      getPortfolios: getPortfolios
    };

  })

var app = angular.module('app');

var app = angular.module('app');

app.factory('forumFactory', ['$http', function($http){

  var addNewTopic = function(topic){
    return $http({
      method: 'POST',
      url: '/api/forum',
      data: topic
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  var showAllTopics = function(){
    return $http({
      method: 'GET',
      url: '/api/forum',
    })
    .then(function(topics){
      return topics;
    });
  }

  var getOneTopic = function(id){
    console.log('SERVICE: ', id)
    return $http({
      method: 'POST',
      url: '/api/forum/topic',
      data: {id: id}
    })
  }


  return {
    addNewTopic: addNewTopic,
    showAllTopics: showAllTopics,
    getOneTopic: getOneTopic
  };


}])
app

  .factory('leaderBoardFactory', function($http){

    var getPortfolios = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: leagueID}
      })
      .then(function(portfolios){
        return portfolios.data;
      });
    };

    return {
      getPortfolios: getPortfolios
    };

  })
var app = angular.module('app');
// to maintain scrollbar at bottom when new message is posted
app.directive('scrollDirective', function ($rootScope) {
  return {
    scope: {
      scrollDirective: '='
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollDirective', function (newValue) {
        if (newValue) {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });

      $rootScope.$on('scrollDown', function() {
        setTimeout(function() {
          $(element).scrollTop($(element)[0].scrollHeight);
        }, 0);
      });
    }
  }
})

// functions to show message board posts and submit them
app.factory('messageBoardFactory', function($http){

    var showPosts = function(id){
        return $http({
          method: 'POST',
          url: '/api/messages/leagues',
          data: {id: id}
        })
        .then(function(posts){
          return posts;
        });
    };

    var submitPost = function(post){
        return $http({
          method: 'POST',
          url: '/api/messages',
          data: post
        })
        .then(function(members){
          return members;
        });
    };

    return {
      showPosts: showPosts,
      submitPost: submitPost,
    };
  })

app.factory('News', ['$http', function($http) {
  var getNews = function(userId, leagueId) {
    return $http({
      method: 'Get',
      url: '/api/tweets/'+leagueId+'/'+userId
    });
  };
  return {
    getNews: getNews
  };
}]);

app.factory('orderStatusFactory', function($http){

  var getOrders = function(data){
    return $http({
      method: 'POST',
      url: 'api/transactions/getorders',
      data: data,
      headers: {"Content-Type": "application/json;charset=utf-8"}
    })
    .then(function(orders){
      return orders.data;
    });
  }

  return {
    getOrders: getOrders
  }

})
app.factory('Portfolio', function($http){

  var buySell = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions',
      data: options
    }).then(function(data){
      return data;
    })
  }

  var limitOrder = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions/limitorder',
      data: options
    }).then(function(data){
      return data;
    })
  }

  var getStock = function(stockName){
    return $http({
      method: 'GET',
      url: '/api/stocks/'+stockName
    }).then(function(stock){
      return stock.data.query.results.quote;
    })
  }

  var getPortfolio = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/'+leagueId+'/'+userId
    }).then(function(portfolio){
      //console.log('User Account Info (incl. Balance)', portfolio.data);
      return portfolio.data;
    })
  }

  var getUserStocks = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    })
  }

  var updateUserStocks = function(leagueId, userId){
    return $http({
      method: 'PUT',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    });
  }

  return {
    getStock: getStock,
    buySell: buySell,
    getPortfolio: getPortfolio,
    getUserStocks: getUserStocks,
    updateUserStocks: updateUserStocks,
    limitOrder: limitOrder
  }
})


var app = angular.module('app');

app.factory('preLeagueFactory', function($http, $stateParams){

  var getName = function(leagueId){
    return $http({
      method: 'GET',
      url: '/api/leagues/'+leagueId,
    })
    .then( function (league) {
      return league.data.name;
    });
  }

  return {
    getName: getName
  }


})
var app = angular.module('app');

app.factory('symbolFactory', function($http){

  var getCompany = function(company){
    return $http({
      method: 'GET',
      url: '/api/symbols/'+company,
    })
    .then( function (data) {
      console.log(data)
      return data;
    });
  }

  return {
    getCompany: getCompany
  }

})
var app = angular.module('app');

app.factory('topicFactory', ['$http', function($http){

  var addNewReply = function(userReply){
    return $http({
      method: 'POST',
      url: '/api/topics',
      data: userReply
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  // add topicId back as an argument
  var showAllReplies = function(topicId){
    return $http({
      method: 'GET',
      url: '/api/topics/'+topicId
    })
    .then(function(replies){
      return replies;
    });
  }



  return {
    addNewReply: addNewReply,
    showAllReplies: showAllReplies
  };

}])
app.factory('transactionFactory', function ($http){

  var getleagueTransactions = function(arr) {
    return $http({
      method: 'Post',
      url: '/api/recentTransactions/',
      data: {'data':arr}
    });
  };
  return {
    getleagueTransactions: getleagueTransactions
  };
});

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

//signin signup controller
.controller('SigninController', ['$scope', '$window', 'Auth', '$rootScope', function($scope, $window, Auth, $rootScope){
  $scope.user = {};
  //$scope.loggedin = false;
  $scope.username;

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
  };

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
  };

  $scope.logout = function(user){
    $scope.loggedin = false;
    $window.localStorage.removeItem('com.tp');
    $window.localStorage.removeItem('com.tp.userId');
    $window.localStorage.removeItem('com.tp.username');
    $window.location.href = '/#/';
  };
}]);

app.controller('SymbolController', ['$scope', '$http', 'symbolFactory', 'Portfolio', '$rootScope', function($scope, $http, symbolFactory, Portfolio, $rootScope){

  $scope.stockName;

  $scope.results=[];
  $scope.getStock = function(stock){
   $scope.results=[];
   var filter =[];
   var symbol;
    symbolFactory.getCompany(stock).then(function(data){
      var sym = data.data.ResultSet.Result;
      for(var j=0;j<sym.length;j++){
         if(sym[j].exchDisp === 'NYSE' || sym[j].exchDisp === 'NASDAQ'){
           filter.push(sym[j]);
         }
      }
      if(!filter.length){
        Materialize.toast('Company could not be found on NYSE or NASDAQ! Check for spaces and punctuation', 5000);
      }

      for(var i=0;i<filter.length;i++){
        $scope.results.push({'symbol' : filter[i].symbol, 'name': filter[i].name});
        }
      $scope.stockName = '';
    });

  };

  $scope.openModal = function(){
    $('#modal1').openModal();
  };

  $scope.closeModal = function(){
    $('#modal1').closeModal();
  };


  $scope.populate = function(symbol){
    $rootScope.$emit('symbolRetrieved', symbol);
    $scope.closeModal();
  };

}]);

var app = angular.module('app');

app.controller('TopicController', ['$scope', 'topicFactory', '$stateParams', '$window', 'forumFactory', '$location', '$anchorScroll', function($scope, topicFactory, $stateParams, $window, forumFactory, $location, $anchorScroll){

  // functionality to show and hide reply form field
  $scope.replyClicked = false;

  $scope.reply = function(){
    $scope.replyClicked = true;
  };

  $scope.cancelReply = function(){
    $scope.replyClicked = false;
  };

  // functionality to generate a reply and post

  $scope.allReplies;
  $scope.topicReply = {};
  $scope.topicReply.topicId = $stateParams.topicId;
  $scope.topicReply.userName = $window.localStorage.getItem('com.tp.username');
  $scope.topicReply.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.topicReply.message = '';

  $scope.topicInfo;

  $scope.submitReply = function(reply){
    topicFactory.addNewReply(reply).then(function(err, res){
      if(err){console.log(err)}
    })
    .then(function(){
      $scope.topicReply.message = '';
      $scope.cancelReply();
      $scope.getAllReplies();
    });
  };

  $scope.getAllReplies = function(){
    topicFactory.showAllReplies($scope.topicReply.topicId).then(function(data){
      $scope.allReplies = data.data;
    });
  };

  $scope.getOneTopic = function(){
    forumFactory.getOneTopic($scope.topicReply.topicId).then(function(data){
      $scope.topicInfo = data.data[0];
    });
  };

  $scope.momentJS = function(time){
    return moment(time).fromNow();
  };

  $scope.lastPost = function(){
    $location.hash('last');
  };

  $scope.toTop = function(){
    $location.hash('top');
  };

  $scope.getOneTopic();
  $scope.getAllReplies();
  $anchorScroll();

}]);

app.controller('FaqsController', function(){



});
var app = angular.module('app')

app.controller('MainForumController', ['$scope', '$window', 'forumFactory', '$rootScope', '$location', '$anchorScroll','topicFactory', function($scope, $window, forumFactory, $rootScope, $location, $anchorScroll, topicFactory){

  $scope.sortLatest = 'createdAt';
  $scope.sortReverse = true;
  $scope.topic = {};
  $scope.topic.username = $window.localStorage.getItem('com.tp.username');
  $scope.topic.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.allTopics;

  $scope.openModal = function(){
    $('#createForumPost').openModal();
  };

  $scope.createTopic = function(topic){
    forumFactory.addNewTopic(topic).then(function(err, res){
      if(err){console.log(err)}
    }).then(function(){
      $scope.topic.title = '';
      $scope.topic.description = '';
      $('#createForumPost').closeModal();
      $scope.showAllTopics();
      $scope.goToTop();
    });
  };

  $scope.showAllTopics = function(){
    forumFactory.showAllTopics().then(function(data){
      $scope.allTopics = data.data;

      for(var i = 0; i < $scope.allTopics.length; i++){

        (function(index){
          $scope.allTopics[index].replies = 0;
          topicFactory.showAllReplies($scope.allTopics[index].id)
            .then(function(replies){
              console.log('#ofREPLIES: ', replies);
              $scope.allTopics[index].replies = replies.data.length;

            });
        })(i)
      }

    });
  };


  $scope.goToTop = function(){
    $location.hash('top');
    $anchorScroll();
  };

  $scope.showAllTopics();

}]);

  // $(document).ready(function(){

  // 	setTimeout(function(){
	 //    console.log(document.getElementById('widget-container'))
	 //    $('#widget-container').html('<script type="text/javascript" src="https://www.barchart.com/widget.js?uid=7a89c27aa42a40916668fe0d82edec22&widgetType=leaders&lbType=stock&widgetWidth=300&fontColor%5Blinks%5D=004376&font=1&tabs%5B%5D=active&tabs%5B%5D=gainers&tabs%5B%5D=losers&symbox=1&fields%5B%5D=name&fields%5B%5D=symbol&fields%5B%5D=last&fields%5B%5D=pctchange&displayChars="></script>');
	 //    // $('.widget-container').write('hey');
	 //  }, 2000);

  // });
app.controller('LeaderBoardController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'leaderBoardFactory', '$location', '$rootScope' ,function($scope, $window, $stateParams, DashboardFactory, leaderBoardFactory, $location, $rootScope){

  // members will be an object of each member in the league
  // containing name, portfolio value, and other stats
  // desired to go on the leaderboard
  $scope.members = [
    {
      username: 'Sonny',
      value: 15000,
      return: '10%',
      transactions: 25
    },
    {
      username: 'Ted',
      value: 9000,
      return: '20%',
      transactions: 45
    },
    {
      username: 'Devonte',
      value: 3567,
      return: '6%',
      transactions: 5
    }
  ];

  $scope.leagueId = $stateParams.leagueId;
  $scope.portfolios;
  $scope.leagueName;

  $scope.getLeaderBoard = function(){
    // this will call a factory function to grab http data from server and assign returned data to $scope.members;
    leaderBoardFactory.getPortfolios($scope.leagueId)
      .then(function(portfolios){
        var userId = $window.localStorage.getItem('com.tp.userId');
        var joined = false;
        for(var i=0; i<portfolios.length; i++){
          if(portfolios[i].UserId === Number(userId)) joined = true;
        }
        $scope.portfolios = portfolios;
        $scope.leagueName = portfolios[0].leaguename;
        $scope.code = portfolios[0].code;
        if(!joined) {
          $window.location.href = '/#/dashboard';
          Materialize.toast('You are not in the league.',1000);
        }
      });
  };

  $scope.getLeagueById = function(){
    DashboardFactory.getLeagueById($scope.leagueId).then(function(data){
      $scope.secretCode = data.code;
    });
  };

  $scope.getLeagueById();
  $scope.getLeaderBoard();
  // once we have league ID, call to initialize leaderboard
  //$scope.getLeaderBoard(leagueId);
  $rootScope.$on("PortfolioUpdate", function(){
    $scope.getLeaderBoard();
  });
}]);

app.controller('LeagueController', ['$scope', '$stateParams', 'DashboardFactory', function($scope, $stateParams, DashboardFactory){
  //Gets the league
  var leagueId = $stateParams.leagueId;

  // initialize a flag indicating that the league has not started yet
  $scope.hasStarted = false;
  $scope.hasEnded = false;
  // grab the current moment using moment.js
  var currentMoment = moment().utc();

  $scope.checkStart = function (league) {
    var start = moment(league.start).utc();
    if (currentMoment.isBefore(start)) {
      $scope.hasStarted = false;
    } else {
      $scope.hasStarted = true;
      // TODO: add this to the databse
    }
  };

  $scope.checkEnd = function (league) {
    var end = moment(league.end).utc();
    if (currentMoment.isAfter(end)) {
      $scope.hasEnded = true;
    } else {
      $scope.hasEnded = false;
      // TODO: add this to the databse
    }
  };

  $scope.checkTradingHours = function () {
    var tradingStart = moment().utc().hour(13).minute(30);
    var tradingEnd = moment().utc().hour(20);
    $scope.isBetweenTradingHours = currentMoment.isBetween(tradingStart, tradingEnd);
  };

  DashboardFactory.getLeagueById(leagueId)
    .then(function(league){
      $scope.league = league;
      // TODO: make this run conditionally
      // if (league.hasStarted === false ) {
      //   run the checkStart
      // }
      $scope.checkStart($scope.league);
      $scope.checkEnd($scope.league);
      if ($scope.hasStarted || !$scope.hasEnded) {
        $scope.checkTradingHours();
      }
    });


}]);

angular.module('app.leagueResults', [])

.controller('LeagueResultsController', function($scope, $stateParams, $window, leaderBoardFactory, DashboardFactory, Portfolio){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');

  // Getting the winner of the league
  leaderBoardFactory.getPortfolios(leagueId)
    .then(function(portfolios){
			var max = 0, winner;
			portfolios.forEach(function(portfolio){
				if (portfolio.balance + portfolio.portfolioValue > max){
					max = portfolio.balance + portfolio.portfolioValue;
					winner = portfolio;
				}
			});

			$scope.winner = winner;
   	});

  // Getting the current league
  DashboardFactory.getLeagueById(leagueId)
  	.then(function(league){
  		$scope.league = league;
  	});

  //Getting user stocks
  //updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions;

			var mostShares = 0 , mostStockShares;
			transactions.forEach(function(transaction){
				if (transaction.shares > mostShares){
					mostShares = transaction.shares;
					mostStockShares = transaction;
				}
			});
			$scope.mostShares = mostStockShares;
		});

});

var app = angular.module('app');

app.controller('MessageBoardController', function($scope, messageBoardFactory, $rootScope, $window, $stateParams){

  $scope.posts;

  $scope.userPost = {};
  $scope.userPost.name = $window.localStorage.getItem('com.tp.username');
  $scope.userPost.leagueId = $stateParams.leagueId;

  $scope.messageBoardPost = function(){

    messageBoardFactory.submitPost($scope.userPost).then(function(){

      messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
        var posts = posts;
        $scope.posts = posts.data;
        console.log(posts);
        $scope.userPost.message = '';
        $rootScope.$emit('scrollDown');
      });

    });
  };

  $scope.leagueId;


  var showPosts = function(){
    messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
    var posts = posts;
    $scope.posts = posts.data;
  });
};

  showPosts();
  // $window.setInterval(showPosts, 1000);

});

app.controller('NewsController', ['$scope', '$window', '$stateParams', 'News', function($scope, $window, $stateParams, News){


  $scope.tweets = [];

  $scope.getTweets= function(){

    var leagueId = $stateParams.leagueId;
    var userId = $window.localStorage.getItem('com.tp.userId');
    $scope.tweets = [];
    News.getNews(userId, leagueId)
    .then(function (res){
      res.data.forEach(function(tweet){
        $scope.tweets.push({text : tweet.text, user : tweet.user, time: tweet.created_at});
      });

    });
  };
  //$scope.getTweets();
}]);

app.controller('orderStatusController', ['$scope', '$window', '$stateParams', 'orderStatusFactory', function($scope, $window, $stateParams, orderStatusFactory){

  $scope.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.leagueId = $stateParams.leagueId;

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

  $scope.openModal = function(){
    $('#modal2').openModal();
  };

  $scope.closeModal = function(){
    $('#modal2').closeModal();
  };

}]);

angular.module('app.portfolio', [])

.controller('PortfolioController', ['$scope', '$window', '$stateParams', 'Portfolio', '$rootScope', function($scope, $window, $stateParams, Portfolio, $rootScope){
	// MAKE A TRADE MODAL
	$scope.leagueId = $stateParams.leagueId;
	$scope.userId = $window.localStorage.getItem('com.tp.userId');
	$scope.fees = 10;
	$scope.estPrice = 0;
	$scope.action = false;
	$scope.singlePrice = 0;

	$rootScope.$on('symbolRetrieved', function(event, data){
		return $scope.chooseStock(data);
	});

	$scope.resetFields = function (){
		$scope.stock = undefined;
		$scope.stockAmount = '';
		$scope.stockInput = '';
		$scope.estPrice = '';
		$scope.singlePrice = '';
		$scope.total = '';
	};

	$scope.chooseStock = function(stockName){
		Portfolio.getStock(stockName).then(function(stock){
			if(!stock.Ask){
				Materialize.toast('Please enter a valid symbol!',3000);
			}
			else {
			$scope.stock = stock;
			$scope.estPrice = stock.Ask;
			$scope.singlePrice = stock.Ask;
		}
		});
		$scope.resetFields();
	};

	// Either buys a stock or sells it depending on selection
	$scope.performAction = function(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');
		var options = {
			symbol: $scope.stock.symbol,
			company: $scope.stock.Name,
			leagueId: leagueId,
			userId:  userId,
			shares: $scope.stockAmount,
			price: $scope.stock.Ask,
			marketPrice: $scope.stock.Ask,
			buysell: !$scope.action
		};
		// if selling stock, must own it and enough shares
		if (!options.buysell && !ableToSell()){
			return false;
		} else if (options.buysell && $scope.total > $scope.balance){
			Materialize.toast("Your balance isn't high enough to make this trade", 3000, 'rounded');
			return false;
		} else if (options.buysell && Number($scope.singlePrice) < Number($scope.stock.Ask)){
			options.price = $scope.singlePrice;
			options.executed = false;
			Portfolio.limitOrder(options).then(function(data){
			});
			Materialize.toast("Your limit order has been placed", 3000, 'rounded');
			$scope.resetFields();
			return false;
		} else {
			options.executed = true;
			Portfolio.limitOrder(options).then(function(data){
			});
			Portfolio.buySell(options).then(function(data){
				Materialize.toast('You traded '+options.shares+' shares in '+options.company, 3000, 'rounded');
				$scope.resetFields();
				updatePortfolio();
			});
		}
	};

	function ableToSell(){
		for (var i = 0; i < $scope.stocks.length; i++){
			if ($scope.stocks[i].symbol === $scope.stock.symbol){
				if ($scope.stockAmount <= $scope.stocks[i].shares){
					return true;
				} else {
					Materialize.toast('You are selling more shares in this company than you own', 3000, 'rounded');
					return false;
				}
			}
		}
		Materialize.toast('You do not own this share to sell', 3000, 'rounded');
		return false;
	}

	$scope.sellStock = function(stock){
    $scope.chooseStock(stock.symbol);
    $scope.action = true;

		//animation to scroll
		$('html, body').animate({
        scrollTop: $(".make-trades").offset().top
    }, 1500);
	};

	$scope.updateAmounts = function(){
		$scope.estPrice = $scope.stockAmount * $scope.singlePrice;
		$scope.total = $scope.estPrice + $scope.fees;
	};

	$scope.updateMarketPrice = function(){
			if ($scope.stocks.length > 0){
				Portfolio.updateUserStocks($scope.leagueId, $scope.userId).then(function(stocks){

				  if (stocks.error){
				  	Materialize.toast('Error updating market prices. Try again in a 30 seconds.', 5000, 'rounded');
				  } else {
				  	Materialize.toast('Market Price Updated', 3000, 'rounded');
				  	updatePortfolio();
				  }
				});
			}
		};

	// MY STOCKS MODAL
	updatePortfolio();
	// $scope.updateMarketPrice();

	function updatePortfolio(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');


		//updating user balance
		Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
		});

		//updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions;
            transactions.forEach(function(transaction){
              console.log(Math.round((transaction.marketPrice*transaction.shares)/$scope.portfolioValue*100),'&&&');
              transaction.percentage = Math.round((transaction.marketPrice*transaction.shares)/$scope.portfolioValue*100);
            });
			$scope.stocks = transactions;
		});



    $rootScope.$emit("PortfolioUpdate", {});
	}
}]);

app.controller('PortfolioChartController', ['$scope', 'Portfolio', '$stateParams', '$window', function($scope, Portfolio,$stateParams,$window){

$scope.data1 = {
		series: ['yo', 'yo1'],
		data: [{
			x: "Cash",
			y: [50],
			//tooltip: "this is tooltip"
		},
		{
			x:'Stocks',
			y:[50],
		}]
	};
	$scope.chartType = 'pie';

	$scope.config1 = {
		labels: true,
		click: function(d) {
			$scope.getBalance();
			Materialize.toast('Assets Updated!', 1000);
		},
		title: "Asset Allocation",
		legend: {
			display: true,
			position: 'right'
		},
		colors: ['#6baed6','#9ecae1'],
		innerRadius: 0
	};


$scope.getBalance = function (){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');
    Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
			$scope.total = $scope.balance + $scope.portfolioValue;
			$scope.data1.data[0].y[0]=(Math.round($scope.balance/$scope.total*100));
			$scope.data1.data[1].y[0]=(Math.round($scope.portfolioValue/$scope.total*100));
		});

};
$scope.getBalance();

}]);

app.controller('PreLeagueController', ['$scope', '$stateParams', 'preLeagueFactory', function($scope, $stateParams, preLeagueFactory){

  $scope.leagueId = $stateParams.leagueId;
  $scope.leagueName;

  $scope.getLeagueName = function(){
    preLeagueFactory.getName($scope.leagueId)
      .then(function(name){
        $scope.leagueName = name;
      });
  };

  $scope.pre = false;
  $scope.suspended = true;

  $scope.getLeagueName();

  // this is the start date, time of the league
  $scope.date;


}]);

angular.module('app.profile', [])

.controller('ProfileController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'AccountFactory', function($scope, $window, $stateParams, DashboardFactory, AccountFactory){
	$scope.id = $stateParams.userId;
	$scope.username = $window.localStorage.getItem('com.tp.username');

	$scope.getUserLeagues = function () {
    DashboardFactory.getUserLeagues($scope.id)
      .then(function(portfolios){
        $scope.portfolios = portfolios;
      });
  };

  $scope.getLeaguesByOwnerId = function(){
    AccountFactory.getLeaguesByOwnerId($scope.id).then(function(data){
      $scope.leagues = data;
      console.log('leagues created', data);
    });
  };

  // This functions needs to be created
  $scope.getLeaguesWonById = function(){

  	$scope.leaguesWon = [];
  };

  $scope.getUser = function(){
    AccountFactory.getSingleUser($scope.id)
      .then(function(user){
        $scope.user = user;
        $scope.email = user.email;
        $scope.image = user.image || '../assets/img/no-avatar.png';
      });
  };

  $scope.getUser();

  $scope.getLeaguesWonById();
  $scope.getLeaguesByOwnerId();
  $scope.getUserLeagues();
}]);

var app = angular.module('app')

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})

.filter('negative', function () {
   return function (items) {
    if(items <1){
      return Math.abs(items);
    }
    else{
      return Math.abs(items);
    }
  };
})

.controller('recentTransactionsController', ['$scope', 'transactionFactory', '$stateParams', 'leaderBoardFactory', function ($scope, transactionFactory, $stateParams, leaderBoardFactory) {

  var leagueId = $stateParams.leagueId;

  $scope.portfolios =[];
  $scope.transactions = [];
  $scope.usernames = {};

  $scope.getleagueTransactions = function (arr) {
    	  $scope.transactions =[];
        transactionFactory.getleagueTransactions(arr)
        .then(function (transactions){

        		angular.forEach(transactions.data, function (transaction){

        			for(var k in $scope.usernames){
        				if(parseInt(k) === transaction.portfolioid){
        					transaction.portfolioid = $scope.usernames[k];
        				}
        			}
        			$scope.transactions.push(transaction);
        		});
        });
  };
  $scope.getPortfolios = function () {
  	leaderBoardFactory.getPortfolios(leagueId)
  	  .then(function (portfolios) {
  	  	portfolios.forEach(function (portfolio) {
  	  		var id = portfolio.id;
  	  		$scope.usernames[portfolio.id]= portfolio.username;
  	  		$scope.portfolios.push({'PortfolioId': portfolio.id});
  	  	});
        $scope.getleagueTransactions($scope.portfolios);
  	  });
  };
}]);

app

  .factory('AccountFactory', function($http){

    var deleteAccount = function(userID){
      return $http({
        method: 'DELETE',
        url: 'api/users/',
        data: {id: userID},
        headers: {"Content-Type": "application/json;charset=utf-8"}
      })
      .then(function(user){
        console.log(user + ', successfully deleted');
      });
    };

    var editLogin = function(user){
      console.log(user.userId)
      return $http.put('api/users/'+user.userId, {
          id: user.userId,
          email: user.email,
          password: user.pass,
          oldpassword: user.oldpass
        }
      )
      .then(function(user){
        return user;
      })
    };

    var getSingleUser = function(userID){
      return $http({
        method: 'POST',
        url: 'api/users/getuser',
        data: {id: userID},
      })
      .then(function(user){
        return user.data;
      });
    };


    var getLeaguesByOwnerId = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/owner/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    var editOneLeague = function(id, data){
      return $http({
        method: 'PUT',
        url: '/api/leagues/'+id,
        data: data
      })
      .then(function(league){

      });
    }

    var deleteLeagueById = function(id, data){
      return $http({
        method: 'DELETE',
        url: '/api/leagues/'+id
      })
      .then(function(data){
        console.log(data);
      });
    }

    var profileImage = function(data){
      console.log(data);
      return $http({
        method: 'POST',
        url: 'api/users/profileimage',
        data: data,
      })
      .then(function(user){
        return user.data;
      });
    }

    return {
      deleteAccount: deleteAccount,
      editLogin: editLogin,
      getSingleUser: getSingleUser,
      getLeaguesByOwnerId: getLeaguesByOwnerId,
      editOneLeague: editOneLeague,
      deleteLeagueById: deleteLeagueById,
      getSingleUser: getSingleUser,
      profileImage: profileImage
    };

  })
app.factory('Auth', function($http, $location, $window){

  var createuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    })
    .then(function(data){
      return data.data;
    });
  };

  var loginuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function(data){
      return data.data;
    })
  }

  var isAuth = function() {
    return !!$window.localStorage.getItem('com.tp');
  };

  return {
    isAuth: isAuth,
    createuser: createuser,
    loginuser: loginuser
  };

});
app
  .factory('BadgeFactory', ['$http', function ($http) {
    var getBadges = function(userId){
      return $http({
        method: 'POST',
        url: '/api/badges/getBadges',
        data: {userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };
    var getPossibleBadges = function(userId){
      return $http({
        method: 'POST',
        url: '/api/badges/possibleBadges',
        data: {userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    var postBadge = function(userId, badge){
      return $http({
        method: 'POST',
        url: '/api/badges',
        data: {badge: badge, userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    return {
      getBadges: getBadges,
      getPossibleBadges: getPossibleBadges,
      postBadge: postBadge
    };
  }]);

app

  .factory('DashboardFactory', function($http){

    var addLeague = function(league){
      return $http({
        method: 'POST',
        url: '/api/leagues',
        data: league
      })
      .then( function(league){
        return league.data;
      });
    };

    var joinLeague = function(leagueId, userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/joinleague',
        data: { leagueId: leagueId,
                userId: userId }
      })
      .then( function(data){
        return data;
      });
    };

    var getUserLeagues = function(userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/userleague',
        data: {userId: userId}
      })
      .then( function (portfolios) {
        // TODO: Structure this appropriately once you have the exact route
        return portfolios.data;
      }
      );
    };

    var getAvailLeagues = function(){
      return $http({
        method: 'GET',
        url: '/api/leagues/'
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    };

    var getLeagueById = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    var getPortfolios = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: leagueID}
      })
      .then(function(portfolios){
        return portfolios.data;
      });
    };

    return {
      addLeague: addLeague,
      getUserLeagues: getUserLeagues,
      getAvailLeagues: getAvailLeagues,
      joinLeague: joinLeague,
      getLeagueById: getLeagueById,
      getPortfolios: getPortfolios
    };

  })

var app = angular.module('app');

var app = angular.module('app');

app.factory('forumFactory', ['$http', function($http){

  var addNewTopic = function(topic){
    return $http({
      method: 'POST',
      url: '/api/forum',
      data: topic
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  var showAllTopics = function(){
    return $http({
      method: 'GET',
      url: '/api/forum',
    })
    .then(function(topics){
      return topics;
    });
  }

  var getOneTopic = function(id){
    console.log('SERVICE: ', id)
    return $http({
      method: 'POST',
      url: '/api/forum/topic',
      data: {id: id}
    })
  }


  return {
    addNewTopic: addNewTopic,
    showAllTopics: showAllTopics,
    getOneTopic: getOneTopic
  };


}])
app

  .factory('leaderBoardFactory', function($http){

    var getPortfolios = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: leagueID}
      })
      .then(function(portfolios){
        return portfolios.data;
      });
    };

    return {
      getPortfolios: getPortfolios
    };

  })
var app = angular.module('app');
// to maintain scrollbar at bottom when new message is posted
app.directive('scrollDirective', function ($rootScope) {
  return {
    scope: {
      scrollDirective: '='
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollDirective', function (newValue) {
        if (newValue) {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });

      $rootScope.$on('scrollDown', function() {
        setTimeout(function() {
          $(element).scrollTop($(element)[0].scrollHeight);
        }, 0);
      });
    }
  }
})

// functions to show message board posts and submit them
app.factory('messageBoardFactory', function($http){

    var showPosts = function(id){
        return $http({
          method: 'POST',
          url: '/api/messages/leagues',
          data: {id: id}
        })
        .then(function(posts){
          return posts;
        });
    };

    var submitPost = function(post){
        return $http({
          method: 'POST',
          url: '/api/messages',
          data: post
        })
        .then(function(members){
          return members;
        });
    };

    return {
      showPosts: showPosts,
      submitPost: submitPost,
    };
  })

app.factory('News', ['$http', function($http) {
  var getNews = function(userId, leagueId) {
    return $http({
      method: 'Get',
      url: '/api/tweets/'+leagueId+'/'+userId
    });
  };
  return {
    getNews: getNews
  };
}]);

app.factory('orderStatusFactory', function($http){

  var getOrders = function(data){
    return $http({
      method: 'POST',
      url: 'api/transactions/getorders',
      data: data,
      headers: {"Content-Type": "application/json;charset=utf-8"}
    })
    .then(function(orders){
      return orders.data;
    });
  }

  return {
    getOrders: getOrders
  }

})
app.factory('Portfolio', function($http){

  var buySell = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions',
      data: options
    }).then(function(data){
      return data;
    })
  }

  var limitOrder = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions/limitorder',
      data: options
    }).then(function(data){
      return data;
    })
  }

  var getStock = function(stockName){
    return $http({
      method: 'GET',
      url: '/api/stocks/'+stockName
    }).then(function(stock){
      return stock.data.query.results.quote;
    })
  }

  var getPortfolio = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/'+leagueId+'/'+userId
    }).then(function(portfolio){
      //console.log('User Account Info (incl. Balance)', portfolio.data);
      return portfolio.data;
    })
  }

  var getUserStocks = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    })
  }

  var updateUserStocks = function(leagueId, userId){
    return $http({
      method: 'PUT',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    });
  }

  return {
    getStock: getStock,
    buySell: buySell,
    getPortfolio: getPortfolio,
    getUserStocks: getUserStocks,
    updateUserStocks: updateUserStocks,
    limitOrder: limitOrder
  }
})


var app = angular.module('app');

app.factory('preLeagueFactory', function($http, $stateParams){

  var getName = function(leagueId){
    return $http({
      method: 'GET',
      url: '/api/leagues/'+leagueId,
    })
    .then( function (league) {
      return league.data.name;
    });
  }

  return {
    getName: getName
  }


})
var app = angular.module('app');

app.factory('symbolFactory', function($http){

  var getCompany = function(company){
    return $http({
      method: 'GET',
      url: '/api/symbols/'+company,
    })
    .then( function (data) {
      console.log(data)
      return data;
    });
  }

  return {
    getCompany: getCompany
  }

})
var app = angular.module('app');

app.factory('topicFactory', ['$http', function($http){

  var addNewReply = function(userReply){
    return $http({
      method: 'POST',
      url: '/api/topics',
      data: userReply
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  // add topicId back as an argument
  var showAllReplies = function(topicId){
    return $http({
      method: 'GET',
      url: '/api/topics/'+topicId
    })
    .then(function(replies){
      return replies;
    });
  }



  return {
    addNewReply: addNewReply,
    showAllReplies: showAllReplies
  };

}])
app.factory('transactionFactory', function ($http){

  var getleagueTransactions = function(arr) {
    return $http({
      method: 'Post',
      url: '/api/recentTransactions/',
      data: {'data':arr}
    });
  };
  return {
    getleagueTransactions: getleagueTransactions
  };
});

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

//signin signup controller
.controller('SigninController', ['$scope', '$window', 'Auth', '$rootScope', function($scope, $window, Auth, $rootScope){
  $scope.user = {};
  //$scope.loggedin = false;
  $scope.username;

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
  };

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
  };

  $scope.logout = function(user){
    $scope.loggedin = false;
    $window.localStorage.removeItem('com.tp');
    $window.localStorage.removeItem('com.tp.userId');
    $window.localStorage.removeItem('com.tp.username');
    $window.location.href = '/#/';
  };
}]);

app.controller('SymbolController', ['$scope', '$http', 'symbolFactory', 'Portfolio', '$rootScope', function($scope, $http, symbolFactory, Portfolio, $rootScope){

  $scope.stockName;

  $scope.results=[];
  $scope.getStock = function(stock){
   $scope.results=[];
   var filter =[];
   var symbol;
    symbolFactory.getCompany(stock).then(function(data){
      var sym = data.data.ResultSet.Result;
      for(var j=0;j<sym.length;j++){
         if(sym[j].exchDisp === 'NYSE' || sym[j].exchDisp === 'NASDAQ'){
           filter.push(sym[j]);
         }
      }
      if(!filter.length){
        Materialize.toast('Company could not be found on NYSE or NASDAQ! Check for spaces and punctuation', 5000);
      }

      for(var i=0;i<filter.length;i++){
        $scope.results.push({'symbol' : filter[i].symbol, 'name': filter[i].name});
        }
      $scope.stockName = '';
    });

  };

  $scope.openModal = function(){
    $('#modal1').openModal();
  };

  $scope.closeModal = function(){
    $('#modal1').closeModal();
  };


  $scope.populate = function(symbol){
    $rootScope.$emit('symbolRetrieved', symbol);
    $scope.closeModal();
  };

}]);

var app = angular.module('app');

app.controller('TopicController', ['$scope', 'topicFactory', '$stateParams', '$window', 'forumFactory', '$location', '$anchorScroll', function($scope, topicFactory, $stateParams, $window, forumFactory, $location, $anchorScroll){

  // functionality to show and hide reply form field
  $scope.replyClicked = false;

  $scope.reply = function(){
    $scope.replyClicked = true;
  };

  $scope.cancelReply = function(){
    $scope.replyClicked = false;
  };

  // functionality to generate a reply and post

  $scope.allReplies;
  $scope.topicReply = {};
  $scope.topicReply.topicId = $stateParams.topicId;
  $scope.topicReply.userName = $window.localStorage.getItem('com.tp.username');
  $scope.topicReply.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.topicReply.message = '';

  $scope.topicInfo;

  $scope.submitReply = function(reply){
    topicFactory.addNewReply(reply).then(function(err, res){
      if(err){console.log(err)}
    })
    .then(function(){
      $scope.topicReply.message = '';
      $scope.cancelReply();
      $scope.getAllReplies();
    });
  };

  $scope.getAllReplies = function(){
    topicFactory.showAllReplies($scope.topicReply.topicId).then(function(data){
      $scope.allReplies = data.data;
    });
  };

  $scope.getOneTopic = function(){
    forumFactory.getOneTopic($scope.topicReply.topicId).then(function(data){
      $scope.topicInfo = data.data[0];
    });
  };

  $scope.momentJS = function(time){
    return moment(time).fromNow();
  };

  $scope.lastPost = function(){
    $location.hash('last');
  };

  $scope.toTop = function(){
    $location.hash('top');
  };

  $scope.getOneTopic();
  $scope.getAllReplies();
  $anchorScroll();

}]);



app.controller('FaqsController', function(){



});
var app = angular.module('app')

app.controller('MainForumController', ['$scope', '$window', 'forumFactory', '$rootScope', '$location', '$anchorScroll','topicFactory', function($scope, $window, forumFactory, $rootScope, $location, $anchorScroll, topicFactory){

  $scope.sortLatest = 'createdAt';
  $scope.sortReverse = true;
  $scope.topic = {};
  $scope.topic.username = $window.localStorage.getItem('com.tp.username');
  $scope.topic.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.allTopics;

  $scope.openModal = function(){
    $('#createForumPost').openModal();
  };

  $scope.createTopic = function(topic){
    forumFactory.addNewTopic(topic).then(function(err, res){
      if(err){console.log(err)}
    }).then(function(){
      $scope.topic.title = '';
      $scope.topic.description = '';
      $('#createForumPost').closeModal();
      $scope.showAllTopics();
      $scope.goToTop();
    });
  };

  $scope.showAllTopics = function(){
    forumFactory.showAllTopics().then(function(data){
      $scope.allTopics = data.data;

      for(var i = 0; i < $scope.allTopics.length; i++){

        (function(index){
          $scope.allTopics[index].replies = 0;
          topicFactory.showAllReplies($scope.allTopics[index].id)
            .then(function(replies){
              console.log('#ofREPLIES: ', replies);
              $scope.allTopics[index].replies = replies.data.length;

            });
        })(i)
      }

    });
  };


  $scope.goToTop = function(){
    $location.hash('top');
    $anchorScroll();
  };

  $scope.showAllTopics();

}]);

  // $(document).ready(function(){

  // 	setTimeout(function(){
	 //    console.log(document.getElementById('widget-container'))
	 //    $('#widget-container').html('<script type="text/javascript" src="https://www.barchart.com/widget.js?uid=7a89c27aa42a40916668fe0d82edec22&widgetType=leaders&lbType=stock&widgetWidth=300&fontColor%5Blinks%5D=004376&font=1&tabs%5B%5D=active&tabs%5B%5D=gainers&tabs%5B%5D=losers&symbox=1&fields%5B%5D=name&fields%5B%5D=symbol&fields%5B%5D=last&fields%5B%5D=pctchange&displayChars="></script>');
	 //    // $('.widget-container').write('hey');
	 //  }, 2000);

  // });
app.controller('LeaderBoardController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'leaderBoardFactory', '$location', '$rootScope' ,function($scope, $window, $stateParams, DashboardFactory, leaderBoardFactory, $location, $rootScope){

  // members will be an object of each member in the league
  // containing name, portfolio value, and other stats
  // desired to go on the leaderboard
  $scope.members = [
    {
      username: 'Sonny',
      value: 15000,
      return: '10%',
      transactions: 25
    },
    {
      username: 'Ted',
      value: 9000,
      return: '20%',
      transactions: 45
    },
    {
      username: 'Devonte',
      value: 3567,
      return: '6%',
      transactions: 5
    }
  ];

  $scope.leagueId = $stateParams.leagueId;
  $scope.portfolios;
  $scope.leagueName;

  $scope.getLeaderBoard = function(){
    // this will call a factory function to grab http data from server and assign returned data to $scope.members;
    leaderBoardFactory.getPortfolios($scope.leagueId)
      .then(function(portfolios){
        var userId = $window.localStorage.getItem('com.tp.userId');
        var joined = false;
        for(var i=0; i<portfolios.length; i++){
          if(portfolios[i].UserId === Number(userId)) joined = true;
        }
        $scope.portfolios = portfolios;
        $scope.leagueName = portfolios[0].leaguename;
        $scope.code = portfolios[0].code;
        if(!joined) {
          $window.location.href = '/#/dashboard';
          Materialize.toast('You are not in the league.',1000);
        }
      });
  };

  $scope.getLeagueById = function(){
    DashboardFactory.getLeagueById($scope.leagueId).then(function(data){
      $scope.secretCode = data.code;
    });
  };

  $scope.getLeagueById();
  $scope.getLeaderBoard();
  // once we have league ID, call to initialize leaderboard
  //$scope.getLeaderBoard(leagueId);
  $rootScope.$on("PortfolioUpdate", function(){
    $scope.getLeaderBoard();
  });
}]);

var app = angular.module('app');

app.controller('MessageBoardController', function($scope, messageBoardFactory, $rootScope, $window, $stateParams){

  $scope.posts;

  $scope.userPost = {};
  $scope.userPost.name = $window.localStorage.getItem('com.tp.username');
  $scope.userPost.leagueId = $stateParams.leagueId;

  $scope.messageBoardPost = function(){

    messageBoardFactory.submitPost($scope.userPost).then(function(){

      messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
        var posts = posts;
        $scope.posts = posts.data;
        console.log(posts);
        $scope.userPost.message = '';
        $rootScope.$emit('scrollDown');
      });

    });
  };

  $scope.leagueId;


  var showPosts = function(){
    messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
    var posts = posts;
    $scope.posts = posts.data;
  });
};

  showPosts();
  // $window.setInterval(showPosts, 1000);

});

angular.module('app.leagueResults', [])

.controller('LeagueResultsController', function($scope, $stateParams, $window, leaderBoardFactory, DashboardFactory, Portfolio){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');

  // Getting the winner of the league
  leaderBoardFactory.getPortfolios(leagueId)
    .then(function(portfolios){
			var max = 0, winner;
			portfolios.forEach(function(portfolio){
				if (portfolio.balance + portfolio.portfolioValue > max){
					max = portfolio.balance + portfolio.portfolioValue;
					winner = portfolio;
				}
			});

			$scope.winner = winner;
   	});

  // Getting the current league
  DashboardFactory.getLeagueById(leagueId)
  	.then(function(league){
  		$scope.league = league;
  	});

  //Getting user stocks
  //updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions;

			var mostShares = 0 , mostStockShares;
			transactions.forEach(function(transaction){
				if (transaction.shares > mostShares){
					mostShares = transaction.shares;
					mostStockShares = transaction;
				}
			});
			$scope.mostShares = mostStockShares;
		});

});

app.controller('NewsController', ['$scope', '$window', '$stateParams', 'News', function($scope, $window, $stateParams, News){


  $scope.tweets = [];

  $scope.getTweets= function(){

    var leagueId = $stateParams.leagueId;
    var userId = $window.localStorage.getItem('com.tp.userId');
    $scope.tweets = [];
    News.getNews(userId, leagueId)
    .then(function (res){
      res.data.forEach(function(tweet){
        $scope.tweets.push({text : tweet.text, user : tweet.user, time: tweet.created_at});
      });

    });
  };
  //$scope.getTweets();
}]);

app.controller('LeagueController', ['$scope', '$stateParams', 'DashboardFactory', function($scope, $stateParams, DashboardFactory){
  //Gets the league
  var leagueId = $stateParams.leagueId;

  // initialize a flag indicating that the league has not started yet
  $scope.hasStarted = false;
  $scope.hasEnded = false;
  // grab the current moment using moment.js
  var currentMoment = moment().utc();

  $scope.checkStart = function (league) {
    var start = moment(league.start).utc();
    if (currentMoment.isBefore(start)) {
      $scope.hasStarted = false;
    } else {
      $scope.hasStarted = true;
      // TODO: add this to the databse
    }
  };

  $scope.checkEnd = function (league) {
    var end = moment(league.end).utc();
    if (currentMoment.isAfter(end)) {
      $scope.hasEnded = true;
    } else {
      $scope.hasEnded = false;
      // TODO: add this to the databse
    }
  };

  $scope.checkTradingHours = function () {
    var tradingStart = moment().utc().hour(13).minute(30);
    var tradingEnd = moment().utc().hour(20);
    $scope.isBetweenTradingHours = currentMoment.isBetween(tradingStart, tradingEnd);
  };

  DashboardFactory.getLeagueById(leagueId)
    .then(function(league){
      $scope.league = league;
      // TODO: make this run conditionally
      // if (league.hasStarted === false ) {
      //   run the checkStart
      // }
      $scope.checkStart($scope.league);
      $scope.checkEnd($scope.league);
      if ($scope.hasStarted || !$scope.hasEnded) {
        $scope.checkTradingHours();
      }
    });


}]);

app.controller('orderStatusController', ['$scope', '$window', '$stateParams', 'orderStatusFactory', function($scope, $window, $stateParams, orderStatusFactory){

  $scope.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.leagueId = $stateParams.leagueId;

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

  $scope.openModal = function(){
    $('#modal2').openModal();
  };

  $scope.closeModal = function(){
    $('#modal2').closeModal();
  };

}]);

angular.module('app.portfolio', [])

.controller('PortfolioController', ['$scope', '$window', '$stateParams', 'Portfolio', '$rootScope', function($scope, $window, $stateParams, Portfolio, $rootScope){
	// MAKE A TRADE MODAL
	$scope.leagueId = $stateParams.leagueId;
	$scope.userId = $window.localStorage.getItem('com.tp.userId');
	$scope.fees = 10;
	$scope.estPrice = 0;
	$scope.action = false;
	$scope.singlePrice = 0;

	$rootScope.$on('symbolRetrieved', function(event, data){
		return $scope.chooseStock(data);
	});

	$scope.resetFields = function (){
		$scope.stock = undefined;
		$scope.stockAmount = '';
		$scope.stockInput = '';
		$scope.estPrice = '';
		$scope.singlePrice = '';
		$scope.total = '';
	};

	$scope.chooseStock = function(stockName){
		Portfolio.getStock(stockName).then(function(stock){
			if(!stock.Ask){
				Materialize.toast('Please enter a valid symbol!',3000);
			}
			else {
			$scope.stock = stock;
			$scope.estPrice = stock.Ask;
			$scope.singlePrice = stock.Ask;
		}
		});
		$scope.resetFields();
	};

	// Either buys a stock or sells it depending on selection
	$scope.performAction = function(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');
		var options = {
			symbol: $scope.stock.symbol,
			company: $scope.stock.Name,
			leagueId: leagueId,
			userId:  userId,
			shares: $scope.stockAmount,
			price: $scope.stock.Ask,
			marketPrice: $scope.stock.Ask,
			buysell: !$scope.action
		};
		// if selling stock, must own it and enough shares
		if (!options.buysell && !ableToSell()){
			return false;
		} else if (options.buysell && $scope.total > $scope.balance){
			Materialize.toast("Your balance isn't high enough to make this trade", 3000, 'rounded');
			return false;
		} else if (options.buysell && Number($scope.singlePrice) < Number($scope.stock.Ask)){
			options.price = $scope.singlePrice;
			options.executed = false;
			Portfolio.limitOrder(options).then(function(data){
			});
			Materialize.toast("Your limit order has been placed", 3000, 'rounded');
			$scope.resetFields();
			return false;
		} else {
			options.executed = true;
			Portfolio.limitOrder(options).then(function(data){
			});
			Portfolio.buySell(options).then(function(data){
				Materialize.toast('You traded '+options.shares+' shares in '+options.company, 3000, 'rounded');
				$scope.resetFields();
				updatePortfolio();
			});
		}
	};

	function ableToSell(){
		for (var i = 0; i < $scope.stocks.length; i++){
			if ($scope.stocks[i].symbol === $scope.stock.symbol){
				if ($scope.stockAmount <= $scope.stocks[i].shares){
					return true;
				} else {
					Materialize.toast('You are selling more shares in this company than you own', 3000, 'rounded');
					return false;
				}
			}
		}
		Materialize.toast('You do not own this share to sell', 3000, 'rounded');
		return false;
	}

	$scope.sellStock = function(stock){
    $scope.chooseStock(stock.symbol);
    $scope.action = true;

		//animation to scroll
		$('html, body').animate({
        scrollTop: $(".make-trades").offset().top
    }, 1500);
	};

	$scope.updateAmounts = function(){
		$scope.estPrice = $scope.stockAmount * $scope.singlePrice;
		$scope.total = $scope.estPrice + $scope.fees;
	};

	$scope.updateMarketPrice = function(){
			if ($scope.stocks.length > 0){
				Portfolio.updateUserStocks($scope.leagueId, $scope.userId).then(function(stocks){

				  if (stocks.error){
				  	Materialize.toast('Error updating market prices. Try again in a 30 seconds.', 5000, 'rounded');
				  } else {
				  	Materialize.toast('Market Price Updated', 3000, 'rounded');
				  	updatePortfolio();
				  }
				});
			}
		};

	// MY STOCKS MODAL
	updatePortfolio();
	// $scope.updateMarketPrice();

	function updatePortfolio(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');


		//updating user balance
		Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
		});

		//updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions;
            transactions.forEach(function(transaction){
              console.log(Math.round((transaction.marketPrice*transaction.shares)/$scope.portfolioValue*100),'&&&');
              transaction.percentage = Math.round((transaction.marketPrice*transaction.shares)/$scope.portfolioValue*100);
            });
			$scope.stocks = transactions;
		});



    $rootScope.$emit("PortfolioUpdate", {});
	}
}]);

app.controller('PortfolioChartController', ['$scope', 'Portfolio', '$stateParams', '$window', function($scope, Portfolio,$stateParams,$window){

$scope.data1 = {
		series: ['yo', 'yo1'],
		data: [{
			x: "Cash",
			y: [50],
			//tooltip: "this is tooltip"
		},
		{
			x:'Stocks',
			y:[50],
		}]
	};
	$scope.chartType = 'pie';

	$scope.config1 = {
		labels: true,
		click: function(d) {
			$scope.getBalance();
			Materialize.toast('Assets Updated!', 1000);
		},
		title: "Asset Allocation",
		legend: {
			display: true,
			position: 'right'
		},
		colors: ['#6baed6','#9ecae1'],
		innerRadius: 0
	};


$scope.getBalance = function (){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');
    Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
			$scope.total = $scope.balance + $scope.portfolioValue;
			$scope.data1.data[0].y[0]=(Math.round($scope.balance/$scope.total*100));
			$scope.data1.data[1].y[0]=(Math.round($scope.portfolioValue/$scope.total*100));
		});

};
$scope.getBalance();

}]);

app.controller('PreLeagueController', ['$scope', '$stateParams', 'preLeagueFactory', function($scope, $stateParams, preLeagueFactory){

  $scope.leagueId = $stateParams.leagueId;
  $scope.leagueName;

  $scope.getLeagueName = function(){
    preLeagueFactory.getName($scope.leagueId)
      .then(function(name){
        $scope.leagueName = name;
      });
  };

  $scope.pre = false;
  $scope.suspended = true;

  $scope.getLeagueName();

  // this is the start date, time of the league
  $scope.date;


}]);

angular.module('app.profile', [])

.controller('ProfileController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'AccountFactory', function($scope, $window, $stateParams, DashboardFactory, AccountFactory){
	$scope.id = $stateParams.userId;
	$scope.username = $window.localStorage.getItem('com.tp.username');

	$scope.getUserLeagues = function () {
    DashboardFactory.getUserLeagues($scope.id)
      .then(function(portfolios){
        $scope.portfolios = portfolios;
      });
  };

  $scope.getLeaguesByOwnerId = function(){
    AccountFactory.getLeaguesByOwnerId($scope.id).then(function(data){
      $scope.leagues = data;
      console.log('leagues created', data);
    });
  };

  // This functions needs to be created
  $scope.getLeaguesWonById = function(){

  	$scope.leaguesWon = [];
  };

  $scope.getUser = function(){
    AccountFactory.getSingleUser($scope.id)
      .then(function(user){
        $scope.user = user;
        $scope.email = user.email;
        $scope.image = user.image || '../assets/img/no-avatar.png';
      });
  };

  $scope.getUser();

  $scope.getLeaguesWonById();
  $scope.getLeaguesByOwnerId();
  $scope.getUserLeagues();
}]);

var app = angular.module('app')

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})

.filter('negative', function () {
   return function (items) {
    if(items <1){
      return Math.abs(items);
    }
    else{
      return Math.abs(items);
    }
  };
})

.controller('recentTransactionsController', ['$scope', 'transactionFactory', '$stateParams', 'leaderBoardFactory', function ($scope, transactionFactory, $stateParams, leaderBoardFactory) {

  var leagueId = $stateParams.leagueId;

  $scope.portfolios =[];
  $scope.transactions = [];
  $scope.usernames = {};

  $scope.getleagueTransactions = function (arr) {
    	  $scope.transactions =[];
        transactionFactory.getleagueTransactions(arr)
        .then(function (transactions){

        		angular.forEach(transactions.data, function (transaction){

        			for(var k in $scope.usernames){
        				if(parseInt(k) === transaction.portfolioid){
        					transaction.portfolioid = $scope.usernames[k];
        				}
        			}
        			$scope.transactions.push(transaction);
        		});
        });
  };
  $scope.getPortfolios = function () {
  	leaderBoardFactory.getPortfolios(leagueId)
  	  .then(function (portfolios) {
  	  	portfolios.forEach(function (portfolio) {
  	  		var id = portfolio.id;
  	  		$scope.usernames[portfolio.id]= portfolio.username;
  	  		$scope.portfolios.push({'PortfolioId': portfolio.id});
  	  	});
        $scope.getleagueTransactions($scope.portfolios);
  	  });
  };
}]);

app

  .factory('AccountFactory', function($http){

    var deleteAccount = function(userID){
      return $http({
        method: 'DELETE',
        url: 'api/users/',
        data: {id: userID},
        headers: {"Content-Type": "application/json;charset=utf-8"}
      })
      .then(function(user){
        console.log(user + ', successfully deleted');
      });
    };

    var editLogin = function(user){
      console.log(user.userId)
      return $http.put('api/users/'+user.userId, {
          id: user.userId,
          email: user.email,
          password: user.pass,
          oldpassword: user.oldpass
        }
      )
      .then(function(user){
        return user;
      })
    };

    var getSingleUser = function(userID){
      return $http({
        method: 'POST',
        url: 'api/users/getuser',
        data: {id: userID},
      })
      .then(function(user){
        return user.data;
      });
    };


    var getLeaguesByOwnerId = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/owner/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    var editOneLeague = function(id, data){
      return $http({
        method: 'PUT',
        url: '/api/leagues/'+id,
        data: data
      })
      .then(function(league){

      });
    }

    var deleteLeagueById = function(id, data){
      return $http({
        method: 'DELETE',
        url: '/api/leagues/'+id
      })
      .then(function(data){
        console.log(data);
      });
    }

    var profileImage = function(data){
      console.log(data);
      return $http({
        method: 'POST',
        url: 'api/users/profileimage',
        data: data,
      })
      .then(function(user){
        return user.data;
      });
    }

    return {
      deleteAccount: deleteAccount,
      editLogin: editLogin,
      getSingleUser: getSingleUser,
      getLeaguesByOwnerId: getLeaguesByOwnerId,
      editOneLeague: editOneLeague,
      deleteLeagueById: deleteLeagueById,
      getSingleUser: getSingleUser,
      profileImage: profileImage
    };

  })
app.factory('Auth', function($http, $location, $window){

  var createuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    })
    .then(function(data){
      return data.data;
    });
  };

  var loginuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function(data){
      return data.data;
    })
  }

  var isAuth = function() {
    return !!$window.localStorage.getItem('com.tp');
  };

  return {
    isAuth: isAuth,
    createuser: createuser,
    loginuser: loginuser
  };

});
app
  .factory('BadgeFactory', ['$http', function ($http) {
    var getBadges = function(userId){
      return $http({
        method: 'POST',
        url: '/api/badges/getBadges',
        data: {userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };
    var getPossibleBadges = function(userId){
      return $http({
        method: 'POST',
        url: '/api/badges/possibleBadges',
        data: {userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    var postBadge = function(userId, badge){
      return $http({
        method: 'POST',
        url: '/api/badges',
        data: {badge: badge, userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    return {
      getBadges: getBadges,
      getPossibleBadges: getPossibleBadges,
      postBadge: postBadge
    };
  }]);

app

  .factory('DashboardFactory', function($http){

    var addLeague = function(league){
      return $http({
        method: 'POST',
        url: '/api/leagues',
        data: league
      })
      .then( function(league){
        return league.data;
      });
    };

    var joinLeague = function(leagueId, userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/joinleague',
        data: { leagueId: leagueId,
                userId: userId }
      })
      .then( function(data){
        return data;
      });
    };

    var getUserLeagues = function(userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/userleague',
        data: {userId: userId}
      })
      .then( function (portfolios) {
        // TODO: Structure this appropriately once you have the exact route
        return portfolios.data;
      }
      );
    };

    var getAvailLeagues = function(){
      return $http({
        method: 'GET',
        url: '/api/leagues/'
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    };

    var getLeagueById = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    var getPortfolios = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: leagueID}
      })
      .then(function(portfolios){
        return portfolios.data;
      });
    };

    return {
      addLeague: addLeague,
      getUserLeagues: getUserLeagues,
      getAvailLeagues: getAvailLeagues,
      joinLeague: joinLeague,
      getLeagueById: getLeagueById,
      getPortfolios: getPortfolios
    };

  })

var app = angular.module('app');

var app = angular.module('app');

app.factory('forumFactory', ['$http', function($http){

  var addNewTopic = function(topic){
    return $http({
      method: 'POST',
      url: '/api/forum',
      data: topic
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  var showAllTopics = function(){
    return $http({
      method: 'GET',
      url: '/api/forum',
    })
    .then(function(topics){
      return topics;
    });
  }

  var getOneTopic = function(id){
    console.log('SERVICE: ', id)
    return $http({
      method: 'POST',
      url: '/api/forum/topic',
      data: {id: id}
    })
  }


  return {
    addNewTopic: addNewTopic,
    showAllTopics: showAllTopics,
    getOneTopic: getOneTopic
  };


}])
app

  .factory('leaderBoardFactory', function($http){

    var getPortfolios = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: leagueID}
      })
      .then(function(portfolios){
        return portfolios.data;
      });
    };

    return {
      getPortfolios: getPortfolios
    };

  })
var app = angular.module('app');
// to maintain scrollbar at bottom when new message is posted
app.directive('scrollDirective', function ($rootScope) {
  return {
    scope: {
      scrollDirective: '='
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollDirective', function (newValue) {
        if (newValue) {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });

      $rootScope.$on('scrollDown', function() {
        setTimeout(function() {
          $(element).scrollTop($(element)[0].scrollHeight);
        }, 0);
      });
    }
  }
})

// functions to show message board posts and submit them
app.factory('messageBoardFactory', function($http){

    var showPosts = function(id){
        return $http({
          method: 'POST',
          url: '/api/messages/leagues',
          data: {id: id}
        })
        .then(function(posts){
          return posts;
        });
    };

    var submitPost = function(post){
        return $http({
          method: 'POST',
          url: '/api/messages',
          data: post
        })
        .then(function(members){
          return members;
        });
    };

    return {
      showPosts: showPosts,
      submitPost: submitPost,
    };
  })

app.factory('News', ['$http', function($http) {
  var getNews = function(userId, leagueId) {
    return $http({
      method: 'Get',
      url: '/api/tweets/'+leagueId+'/'+userId
    });
  };
  return {
    getNews: getNews
  };
}]);

app.factory('orderStatusFactory', function($http){

  var getOrders = function(data){
    return $http({
      method: 'POST',
      url: 'api/transactions/getorders',
      data: data,
      headers: {"Content-Type": "application/json;charset=utf-8"}
    })
    .then(function(orders){
      return orders.data;
    });
  }

  return {
    getOrders: getOrders
  }

})
app.factory('Portfolio', function($http){

  var buySell = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions',
      data: options
    }).then(function(data){
      return data;
    })
  }

  var limitOrder = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions/limitorder',
      data: options
    }).then(function(data){
      return data;
    })
  }

  var getStock = function(stockName){
    return $http({
      method: 'GET',
      url: '/api/stocks/'+stockName
    }).then(function(stock){
      return stock.data.query.results.quote;
    })
  }

  var getPortfolio = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/'+leagueId+'/'+userId
    }).then(function(portfolio){
      //console.log('User Account Info (incl. Balance)', portfolio.data);
      return portfolio.data;
    })
  }

  var getUserStocks = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    })
  }

  var updateUserStocks = function(leagueId, userId){
    return $http({
      method: 'PUT',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    });
  }

  return {
    getStock: getStock,
    buySell: buySell,
    getPortfolio: getPortfolio,
    getUserStocks: getUserStocks,
    updateUserStocks: updateUserStocks,
    limitOrder: limitOrder
  }
})


var app = angular.module('app');

app.factory('preLeagueFactory', function($http, $stateParams){

  var getName = function(leagueId){
    return $http({
      method: 'GET',
      url: '/api/leagues/'+leagueId,
    })
    .then( function (league) {
      return league.data.name;
    });
  }

  return {
    getName: getName
  }


})
var app = angular.module('app');

app.factory('symbolFactory', function($http){

  var getCompany = function(company){
    return $http({
      method: 'GET',
      url: '/api/symbols/'+company,
    })
    .then( function (data) {
      console.log(data)
      return data;
    });
  }

  return {
    getCompany: getCompany
  }

})
var app = angular.module('app');

app.factory('topicFactory', ['$http', function($http){

  var addNewReply = function(userReply){
    return $http({
      method: 'POST',
      url: '/api/topics',
      data: userReply
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  // add topicId back as an argument
  var showAllReplies = function(topicId){
    return $http({
      method: 'GET',
      url: '/api/topics/'+topicId
    })
    .then(function(replies){
      return replies;
    });
  }



  return {
    addNewReply: addNewReply,
    showAllReplies: showAllReplies
  };

}])
app.factory('transactionFactory', function ($http){

  var getleagueTransactions = function(arr) {
    return $http({
      method: 'Post',
      url: '/api/recentTransactions/',
      data: {'data':arr}
    });
  };
  return {
    getleagueTransactions: getleagueTransactions
  };
});

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

//signin signup controller
.controller('SigninController', ['$scope', '$window', 'Auth', '$rootScope', function($scope, $window, Auth, $rootScope){
  $scope.user = {};
  //$scope.loggedin = false;
  $scope.username;

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
  };

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
  };

  $scope.logout = function(user){
    $scope.loggedin = false;
    $window.localStorage.removeItem('com.tp');
    $window.localStorage.removeItem('com.tp.userId');
    $window.localStorage.removeItem('com.tp.username');
    $window.location.href = '/#/';
  };
}]);

app.controller('SymbolController', ['$scope', '$http', 'symbolFactory', 'Portfolio', '$rootScope', function($scope, $http, symbolFactory, Portfolio, $rootScope){

  $scope.stockName;

  $scope.results=[];
  $scope.getStock = function(stock){
   $scope.results=[];
   var filter =[];
   var symbol;
    symbolFactory.getCompany(stock).then(function(data){
      var sym = data.data.ResultSet.Result;
      for(var j=0;j<sym.length;j++){
         if(sym[j].exchDisp === 'NYSE' || sym[j].exchDisp === 'NASDAQ'){
           filter.push(sym[j]);
         }
      }
      if(!filter.length){
        Materialize.toast('Company could not be found on NYSE or NASDAQ! Check for spaces and punctuation', 5000);
      }

      for(var i=0;i<filter.length;i++){
        $scope.results.push({'symbol' : filter[i].symbol, 'name': filter[i].name});
        }
      $scope.stockName = '';
    });

  };

  $scope.openModal = function(){
    $('#modal1').openModal();
  };

  $scope.closeModal = function(){
    $('#modal1').closeModal();
  };


  $scope.populate = function(symbol){
    $rootScope.$emit('symbolRetrieved', symbol);
    $scope.closeModal();
  };

}]);

var app = angular.module('app');

app.controller('TopicController', ['$scope', 'topicFactory', '$stateParams', '$window', 'forumFactory', '$location', '$anchorScroll', function($scope, topicFactory, $stateParams, $window, forumFactory, $location, $anchorScroll){

  // functionality to show and hide reply form field
  $scope.replyClicked = false;

  $scope.reply = function(){
    $scope.replyClicked = true;
  };

  $scope.cancelReply = function(){
    $scope.replyClicked = false;
  };

  // functionality to generate a reply and post

  $scope.allReplies;
  $scope.topicReply = {};
  $scope.topicReply.topicId = $stateParams.topicId;
  $scope.topicReply.userName = $window.localStorage.getItem('com.tp.username');
  $scope.topicReply.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.topicReply.message = '';

  $scope.topicInfo;

  $scope.submitReply = function(reply){
    topicFactory.addNewReply(reply).then(function(err, res){
      if(err){console.log(err)}
    })
    .then(function(){
      $scope.topicReply.message = '';
      $scope.cancelReply();
      $scope.getAllReplies();
    });
  };

  $scope.getAllReplies = function(){
    topicFactory.showAllReplies($scope.topicReply.topicId).then(function(data){
      $scope.allReplies = data.data;
    });
  };

  $scope.getOneTopic = function(){
    forumFactory.getOneTopic($scope.topicReply.topicId).then(function(data){
      $scope.topicInfo = data.data[0];
    });
  };

  $scope.momentJS = function(time){
    return moment(time).fromNow();
  };

  $scope.lastPost = function(){
    $location.hash('last');
  };

  $scope.toTop = function(){
    $location.hash('top');
  };

  $scope.getOneTopic();
  $scope.getAllReplies();
  $anchorScroll();

}]);



app.controller('FaqsController', function(){



});
  // $(document).ready(function(){

  // 	setTimeout(function(){
	 //    console.log(document.getElementById('widget-container'))
	 //    $('#widget-container').html('<script type="text/javascript" src="https://www.barchart.com/widget.js?uid=7a89c27aa42a40916668fe0d82edec22&widgetType=leaders&lbType=stock&widgetWidth=300&fontColor%5Blinks%5D=004376&font=1&tabs%5B%5D=active&tabs%5B%5D=gainers&tabs%5B%5D=losers&symbox=1&fields%5B%5D=name&fields%5B%5D=symbol&fields%5B%5D=last&fields%5B%5D=pctchange&displayChars="></script>');
	 //    // $('.widget-container').write('hey');
	 //  }, 2000);

  // });
app.controller('LeaderBoardController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'leaderBoardFactory', '$location', '$rootScope' ,function($scope, $window, $stateParams, DashboardFactory, leaderBoardFactory, $location, $rootScope){

  // members will be an object of each member in the league
  // containing name, portfolio value, and other stats
  // desired to go on the leaderboard
  $scope.members = [
    {
      username: 'Sonny',
      value: 15000,
      return: '10%',
      transactions: 25
    },
    {
      username: 'Ted',
      value: 9000,
      return: '20%',
      transactions: 45
    },
    {
      username: 'Devonte',
      value: 3567,
      return: '6%',
      transactions: 5
    }
  ];

  $scope.leagueId = $stateParams.leagueId;
  $scope.portfolios;
  $scope.leagueName;

  $scope.getLeaderBoard = function(){
    // this will call a factory function to grab http data from server and assign returned data to $scope.members;
    leaderBoardFactory.getPortfolios($scope.leagueId)
      .then(function(portfolios){
        var userId = $window.localStorage.getItem('com.tp.userId');
        var joined = false;
        for(var i=0; i<portfolios.length; i++){
          if(portfolios[i].UserId === Number(userId)) joined = true;
        }
        $scope.portfolios = portfolios;
        $scope.leagueName = portfolios[0].leaguename;
        $scope.code = portfolios[0].code;
        if(!joined) {
          $window.location.href = '/#/dashboard';
          Materialize.toast('You are not in the league.',1000);
        }
      });
  };

  $scope.getLeagueById = function(){
    DashboardFactory.getLeagueById($scope.leagueId).then(function(data){
      $scope.secretCode = data.code;
    });
  };

  $scope.getLeagueById();
  $scope.getLeaderBoard();
  // once we have league ID, call to initialize leaderboard
  //$scope.getLeaderBoard(leagueId);
  $rootScope.$on("PortfolioUpdate", function(){
    $scope.getLeaderBoard();
  });
}]);

app.controller('LeagueController', ['$scope', '$stateParams', 'DashboardFactory', function($scope, $stateParams, DashboardFactory){
  //Gets the league
  var leagueId = $stateParams.leagueId;

  // initialize a flag indicating that the league has not started yet
  $scope.hasStarted = false;
  $scope.hasEnded = false;
  // grab the current moment using moment.js
  var currentMoment = moment().utc();

  $scope.checkStart = function (league) {
    var start = moment(league.start).utc();
    if (currentMoment.isBefore(start)) {
      $scope.hasStarted = false;
    } else {
      $scope.hasStarted = true;
      // TODO: add this to the databse
    }
  };

  $scope.checkEnd = function (league) {
    var end = moment(league.end).utc();
    if (currentMoment.isAfter(end)) {
      $scope.hasEnded = true;
    } else {
      $scope.hasEnded = false;
      // TODO: add this to the databse
    }
  };

  $scope.checkTradingHours = function () {
    var tradingStart = moment().utc().hour(13).minute(30);
    var tradingEnd = moment().utc().hour(20);
    $scope.isBetweenTradingHours = currentMoment.isBetween(tradingStart, tradingEnd);
  };

  DashboardFactory.getLeagueById(leagueId)
    .then(function(league){
      $scope.league = league;
      // TODO: make this run conditionally
      // if (league.hasStarted === false ) {
      //   run the checkStart
      // }
      $scope.checkStart($scope.league);
      $scope.checkEnd($scope.league);
      if ($scope.hasStarted || !$scope.hasEnded) {
        $scope.checkTradingHours();
      }
    });


}]);

app.controller('NewsController', ['$scope', '$window', '$stateParams', 'News', function($scope, $window, $stateParams, News){


  $scope.tweets = [];

  $scope.getTweets= function(){

    var leagueId = $stateParams.leagueId;
    var userId = $window.localStorage.getItem('com.tp.userId');
    $scope.tweets = [];
    News.getNews(userId, leagueId)
    .then(function (res){
      res.data.forEach(function(tweet){
        $scope.tweets.push({text : tweet.text, user : tweet.user, time: tweet.created_at});
      });

    });
  };
  //$scope.getTweets();
}]);

angular.module('app.leagueResults', [])

.controller('LeagueResultsController', function($scope, $stateParams, $window, leaderBoardFactory, DashboardFactory, Portfolio){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');

  // Getting the winner of the league
  leaderBoardFactory.getPortfolios(leagueId)
    .then(function(portfolios){
			var max = 0, winner;
			portfolios.forEach(function(portfolio){
				if (portfolio.balance + portfolio.portfolioValue > max){
					max = portfolio.balance + portfolio.portfolioValue;
					winner = portfolio;
				}
			});

			$scope.winner = winner;
   	});

  // Getting the current league
  DashboardFactory.getLeagueById(leagueId)
  	.then(function(league){
  		$scope.league = league;
  	});

  //Getting user stocks
  //updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions;

			var mostShares = 0 , mostStockShares;
			transactions.forEach(function(transaction){
				if (transaction.shares > mostShares){
					mostShares = transaction.shares;
					mostStockShares = transaction;
				}
			});
			$scope.mostShares = mostStockShares;
		});

});

app.controller('orderStatusController', ['$scope', '$window', '$stateParams', 'orderStatusFactory', function($scope, $window, $stateParams, orderStatusFactory){

  $scope.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.leagueId = $stateParams.leagueId;

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

  $scope.openModal = function(){
    $('#modal2').openModal();
  };

  $scope.closeModal = function(){
    $('#modal2').closeModal();
  };

}]);

app.controller('PortfolioChartController', ['$scope', 'Portfolio', '$stateParams', '$window', function($scope, Portfolio,$stateParams,$window){

$scope.data1 = {
		series: ['yo', 'yo1'],
		data: [{
			x: "Cash",
			y: [50],
			//tooltip: "this is tooltip"
		},
		{
			x:'Stocks',
			y:[50],
		}]
	};
	$scope.chartType = 'pie';

	$scope.config1 = {
		labels: true,
		click: function(d) {
			$scope.getBalance();
			Materialize.toast('Assets Updated!', 1000);
		},
		title: "Asset Allocation",
		legend: {
			display: true,
			position: 'right'
		},
		colors: ['#6baed6','#9ecae1'],
		innerRadius: 0
	};


$scope.getBalance = function (){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');
    Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
			$scope.total = $scope.balance + $scope.portfolioValue;
			$scope.data1.data[0].y[0]=(Math.round($scope.balance/$scope.total*100));
			$scope.data1.data[1].y[0]=(Math.round($scope.portfolioValue/$scope.total*100));
		});

};
$scope.getBalance();

}]);

var app = angular.module('app');

app.controller('MessageBoardController', function($scope, messageBoardFactory, $rootScope, $window, $stateParams){

  $scope.posts;

  $scope.userPost = {};
  $scope.userPost.name = $window.localStorage.getItem('com.tp.username');
  $scope.userPost.leagueId = $stateParams.leagueId;

  $scope.messageBoardPost = function(){

    messageBoardFactory.submitPost($scope.userPost).then(function(){

      messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
        var posts = posts;
        $scope.posts = posts.data;
        console.log(posts);
        $scope.userPost.message = '';
        $rootScope.$emit('scrollDown');
      });

    });
  };

  $scope.leagueId;


  var showPosts = function(){
    messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
    var posts = posts;
    $scope.posts = posts.data;
  });
};

  showPosts();
  // $window.setInterval(showPosts, 1000);

});

angular.module('app.portfolio', [])

.controller('PortfolioController', ['$scope', '$window', '$stateParams', 'Portfolio', '$rootScope', function($scope, $window, $stateParams, Portfolio, $rootScope){
	// MAKE A TRADE MODAL
	$scope.leagueId = $stateParams.leagueId;
	$scope.userId = $window.localStorage.getItem('com.tp.userId');
	$scope.fees = 10;
	$scope.estPrice = 0;
	$scope.action = false;
	$scope.singlePrice = 0;

	$rootScope.$on('symbolRetrieved', function(event, data){
		return $scope.chooseStock(data);
	});

	$scope.resetFields = function (){
		$scope.stock = undefined;
		$scope.stockAmount = '';
		$scope.stockInput = '';
		$scope.estPrice = '';
		$scope.singlePrice = '';
		$scope.total = '';
	};

	$scope.chooseStock = function(stockName){
		Portfolio.getStock(stockName).then(function(stock){
			if(!stock.Ask){
				Materialize.toast('Please enter a valid symbol!',3000);
			}
			else {
			$scope.stock = stock;
			$scope.estPrice = stock.Ask;
			$scope.singlePrice = stock.Ask;
		}
		});
		$scope.resetFields();
	};

	// Either buys a stock or sells it depending on selection
	$scope.performAction = function(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');
		var options = {
			symbol: $scope.stock.symbol,
			company: $scope.stock.Name,
			leagueId: leagueId,
			userId:  userId,
			shares: $scope.stockAmount,
			price: $scope.stock.Ask,
			marketPrice: $scope.stock.Ask,
			buysell: !$scope.action
		};
		// if selling stock, must own it and enough shares
		if (!options.buysell && !ableToSell()){
			return false;
		} else if (options.buysell && $scope.total > $scope.balance){
			Materialize.toast("Your balance isn't high enough to make this trade", 3000, 'rounded');
			return false;
		} else if (options.buysell && Number($scope.singlePrice) < Number($scope.stock.Ask)){
			options.price = $scope.singlePrice;
			options.executed = false;
			Portfolio.limitOrder(options).then(function(data){
			});
			Materialize.toast("Your limit order has been placed", 3000, 'rounded');
			$scope.resetFields();
			return false;
		} else {
			options.executed = true;
			Portfolio.limitOrder(options).then(function(data){
			});
			Portfolio.buySell(options).then(function(data){
				Materialize.toast('You traded '+options.shares+' shares in '+options.company, 3000, 'rounded');
				$scope.resetFields();
				updatePortfolio();
			});
		}
	};

	function ableToSell(){
		for (var i = 0; i < $scope.stocks.length; i++){
			if ($scope.stocks[i].symbol === $scope.stock.symbol){
				if ($scope.stockAmount <= $scope.stocks[i].shares){
					return true;
				} else {
					Materialize.toast('You are selling more shares in this company than you own', 3000, 'rounded');
					return false;
				}
			}
		}
		Materialize.toast('You do not own this share to sell', 3000, 'rounded');
		return false;
	}

	$scope.sellStock = function(stock){
    $scope.chooseStock(stock.symbol);
    $scope.action = true;

		//animation to scroll
		$('html, body').animate({
        scrollTop: $(".make-trades").offset().top
    }, 1500);
	};

	$scope.updateAmounts = function(){
		$scope.estPrice = $scope.stockAmount * $scope.singlePrice;
		$scope.total = $scope.estPrice + $scope.fees;
	};

	$scope.updateMarketPrice = function(){
			if ($scope.stocks.length > 0){
				Portfolio.updateUserStocks($scope.leagueId, $scope.userId).then(function(stocks){

				  if (stocks.error){
				  	Materialize.toast('Error updating market prices. Try again in a 30 seconds.', 5000, 'rounded');
				  } else {
				  	Materialize.toast('Market Price Updated', 3000, 'rounded');
				  	updatePortfolio();
				  }
				});
			}
		};

	// MY STOCKS MODAL
	updatePortfolio();
	// $scope.updateMarketPrice();

	function updatePortfolio(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');


		//updating user balance
		Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
		});

		//updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions;
            transactions.forEach(function(transaction){
              console.log(Math.round((transaction.marketPrice*transaction.shares)/$scope.portfolioValue*100),'&&&');
              transaction.percentage = Math.round((transaction.marketPrice*transaction.shares)/$scope.portfolioValue*100);
            });
			$scope.stocks = transactions;
		});



    $rootScope.$emit("PortfolioUpdate", {});
	}
}]);

var app = angular.module('app')

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})

.filter('negative', function () {
   return function (items) {
    if(items <1){
      return Math.abs(items);
    }
    else{
      return Math.abs(items);
    }
  };
})

.controller('recentTransactionsController', ['$scope', 'transactionFactory', '$stateParams', 'leaderBoardFactory', function ($scope, transactionFactory, $stateParams, leaderBoardFactory) {

  var leagueId = $stateParams.leagueId;

  $scope.portfolios =[];
  $scope.transactions = [];
  $scope.usernames = {};

  $scope.getleagueTransactions = function (arr) {
    	  $scope.transactions =[];
        transactionFactory.getleagueTransactions(arr)
        .then(function (transactions){

        		angular.forEach(transactions.data, function (transaction){

        			for(var k in $scope.usernames){
        				if(parseInt(k) === transaction.portfolioid){
        					transaction.portfolioid = $scope.usernames[k];
        				}
        			}
        			$scope.transactions.push(transaction);
        		});
        });
  };
  $scope.getPortfolios = function () {
  	leaderBoardFactory.getPortfolios(leagueId)
  	  .then(function (portfolios) {
  	  	portfolios.forEach(function (portfolio) {
  	  		var id = portfolio.id;
  	  		$scope.usernames[portfolio.id]= portfolio.username;
  	  		$scope.portfolios.push({'PortfolioId': portfolio.id});
  	  	});
        $scope.getleagueTransactions($scope.portfolios);
  	  });
  };
}]);

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

  $scope.sortStart = 'start';
  $scope.sortEnd = 'endDate';
  $scope.sortReverse = false;


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
  };

  $scope.pickend = function(){
    var end = $('#enddate').pickadate({
      onSet: function (context) {
        $scope.league.end = new Date(context.select);
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
  };

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
    league.creatorId = creatorId;
    league.creatorName = creatorName;

    league.private = JSON.parse(league.isPrivate);
    DashboardFactory.addLeague(league)
      .then(function(league){
        $scope.toggleAdd();
        if (league.private === true){
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

        for(var i = 0; i < $scope.portfolios.length; i++){

          (function(index){
            $scope.portfolios[index].endDate = '';
            DashboardFactory.getLeagueById($scope.portfolios[index].id)
              .then(function(league){
                $scope.portfolios[index].endDate = league.end;
              })
          })(i)
        }

      })
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
  };

  $scope.notfull = function(league){
    if(league.maxNum - league.usersJoined > 0){
      return true;
    }
  }

  $scope.notstarted = function(league){
    var now = new Date();
    var convertedNow = moment.utc(now).format();
    var start = league.start;

    if(convertedNow <= start){
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
            return false;
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
  };

  $scope.getUserLeagues();
  $scope.getLeaguesToJoin();

}]);

app.controller('PreLeagueController', ['$scope', '$stateParams', 'preLeagueFactory', function($scope, $stateParams, preLeagueFactory){

  $scope.leagueId = $stateParams.leagueId;
  $scope.leagueName;

  $scope.getLeagueName = function(){
    preLeagueFactory.getName($scope.leagueId)
      .then(function(name){
        $scope.leagueName = name;
      });
  };

  $scope.pre = false;
  $scope.suspended = true;

  $scope.getLeagueName();

  // this is the start date, time of the league
  $scope.date;


}]);

angular.module('app.profile', [])

.controller('ProfileController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'AccountFactory', function($scope, $window, $stateParams, DashboardFactory, AccountFactory){
	$scope.id = $stateParams.userId;
	$scope.username = $window.localStorage.getItem('com.tp.username');

	$scope.getUserLeagues = function () {
    DashboardFactory.getUserLeagues($scope.id)
      .then(function(portfolios){
        $scope.portfolios = portfolios;
      });
  };

  $scope.getLeaguesByOwnerId = function(){
    AccountFactory.getLeaguesByOwnerId($scope.id).then(function(data){
      $scope.leagues = data;
      console.log('leagues created', data);
    });
  };

  // This functions needs to be created
  $scope.getLeaguesWonById = function(){

  	$scope.leaguesWon = [];
  };

  $scope.getUser = function(){
    AccountFactory.getSingleUser($scope.id)
      .then(function(user){
        $scope.user = user;
        $scope.email = user.email;
        $scope.image = user.image || '../assets/img/no-avatar.png';
      });
  };

  $scope.getUser();

  $scope.getLeaguesWonById();
  $scope.getLeaguesByOwnerId();
  $scope.getUserLeagues();
}]);

app.controller('SymbolController', ['$scope', '$http', 'symbolFactory', 'Portfolio', '$rootScope', function($scope, $http, symbolFactory, Portfolio, $rootScope){

  $scope.stockName;

  $scope.results=[];
  $scope.getStock = function(stock){
   $scope.results=[];
   var filter =[];
   var symbol;
    symbolFactory.getCompany(stock).then(function(data){
      var sym = data.data.ResultSet.Result;
      for(var j=0;j<sym.length;j++){
         if(sym[j].exchDisp === 'NYSE' || sym[j].exchDisp === 'NASDAQ'){
           filter.push(sym[j]);
         }
      }
      if(!filter.length){
        Materialize.toast('Company could not be found on NYSE or NASDAQ! Check for spaces and punctuation', 5000);
      }

      for(var i=0;i<filter.length;i++){
        $scope.results.push({'symbol' : filter[i].symbol, 'name': filter[i].name});
        }
      $scope.stockName = '';
    });

  };

  $scope.openModal = function(){
    $('#modal1').openModal();
  };

  $scope.closeModal = function(){
    $('#modal1').closeModal();
  };


  $scope.populate = function(symbol){
    $rootScope.$emit('symbolRetrieved', symbol);
    $scope.closeModal();
  };

}]);

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

//signin signup controller
.controller('SigninController', ['$scope', '$window', 'Auth', '$rootScope', function($scope, $window, Auth, $rootScope){
  $scope.user = {};
  //$scope.loggedin = false;
  $scope.username;

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
  };

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
  };

  $scope.logout = function(user){
    $scope.loggedin = false;
    $window.localStorage.removeItem('com.tp');
    $window.localStorage.removeItem('com.tp.userId');
    $window.localStorage.removeItem('com.tp.username');
    $window.location.href = '/#/';
  };
}]);

app

  .factory('AccountFactory', function($http){

    var deleteAccount = function(userID){
      return $http({
        method: 'DELETE',
        url: 'api/users/',
        data: {id: userID},
        headers: {"Content-Type": "application/json;charset=utf-8"}
      })
      .then(function(user){
        console.log(user + ', successfully deleted');
      });
    };

    var editLogin = function(user){
      console.log(user.userId)
      return $http.put('api/users/'+user.userId, {
          id: user.userId,
          email: user.email,
          password: user.pass,
          oldpassword: user.oldpass
        }
      )
      .then(function(user){
        return user;
      })
    };

    var getSingleUser = function(userID){
      return $http({
        method: 'POST',
        url: 'api/users/getuser',
        data: {id: userID},
      })
      .then(function(user){
        return user.data;
      });
    };


    var getLeaguesByOwnerId = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/owner/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    var editOneLeague = function(id, data){
      return $http({
        method: 'PUT',
        url: '/api/leagues/'+id,
        data: data
      })
      .then(function(league){

      });
    }

    var deleteLeagueById = function(id, data){
      return $http({
        method: 'DELETE',
        url: '/api/leagues/'+id
      })
      .then(function(data){
        console.log(data);
      });
    }

    var profileImage = function(data){
      console.log(data);
      return $http({
        method: 'POST',
        url: 'api/users/profileimage',
        data: data,
      })
      .then(function(user){
        return user.data;
      });
    }

    return {
      deleteAccount: deleteAccount,
      editLogin: editLogin,
      getSingleUser: getSingleUser,
      getLeaguesByOwnerId: getLeaguesByOwnerId,
      editOneLeague: editOneLeague,
      deleteLeagueById: deleteLeagueById,
      getSingleUser: getSingleUser,
      profileImage: profileImage
    };

  })
app.factory('Auth', function($http, $location, $window){

  var createuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    })
    .then(function(data){
      return data.data;
    });
  };

  var loginuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function(data){
      return data.data;
    })
  }

  var isAuth = function() {
    return !!$window.localStorage.getItem('com.tp');
  };

  return {
    isAuth: isAuth,
    createuser: createuser,
    loginuser: loginuser
  };

});
app
  .factory('BadgeFactory', ['$http', function ($http) {
    var getBadges = function(userId){
      return $http({
        method: 'POST',
        url: '/api/badges/getBadges',
        data: {userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };
    var getPossibleBadges = function(userId){
      return $http({
        method: 'POST',
        url: '/api/badges/possibleBadges',
        data: {userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    var postBadge = function(userId, badge){
      return $http({
        method: 'POST',
        url: '/api/badges',
        data: {badge: badge, userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    return {
      getBadges: getBadges,
      getPossibleBadges: getPossibleBadges,
      postBadge: postBadge
    };
  }]);

app

  .factory('DashboardFactory', function($http){

    var addLeague = function(league){
      return $http({
        method: 'POST',
        url: '/api/leagues',
        data: league
      })
      .then( function(league){
        return league.data;
      });
    };

    var joinLeague = function(leagueId, userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/joinleague',
        data: { leagueId: leagueId,
                userId: userId }
      })
      .then( function(data){
        return data;
      });
    };

    var getUserLeagues = function(userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/userleague',
        data: {userId: userId}
      })
      .then( function (portfolios) {
        // TODO: Structure this appropriately once you have the exact route
        return portfolios.data;
      }
      );
    };

    var getAvailLeagues = function(){
      return $http({
        method: 'GET',
        url: '/api/leagues/'
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    };

    var getLeagueById = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    var getPortfolios = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: leagueID}
      })
      .then(function(portfolios){
        return portfolios.data;
      });
    };

    return {
      addLeague: addLeague,
      getUserLeagues: getUserLeagues,
      getAvailLeagues: getAvailLeagues,
      joinLeague: joinLeague,
      getLeagueById: getLeagueById,
      getPortfolios: getPortfolios
    };

  })

var app = angular.module('app');

var app = angular.module('app');

app.factory('forumFactory', ['$http', function($http){

  var addNewTopic = function(topic){
    return $http({
      method: 'POST',
      url: '/api/forum',
      data: topic
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  var showAllTopics = function(){
    return $http({
      method: 'GET',
      url: '/api/forum',
    })
    .then(function(topics){
      return topics;
    });
  }

  var getOneTopic = function(id){
    console.log('SERVICE: ', id)
    return $http({
      method: 'POST',
      url: '/api/forum/topic',
      data: {id: id}
    })
  }


  return {
    addNewTopic: addNewTopic,
    showAllTopics: showAllTopics,
    getOneTopic: getOneTopic
  };


}])
app

  .factory('leaderBoardFactory', function($http){

    var getPortfolios = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: leagueID}
      })
      .then(function(portfolios){
        return portfolios.data;
      });
    };

    return {
      getPortfolios: getPortfolios
    };

  })
var app = angular.module('app');
// to maintain scrollbar at bottom when new message is posted
app.directive('scrollDirective', function ($rootScope) {
  return {
    scope: {
      scrollDirective: '='
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollDirective', function (newValue) {
        if (newValue) {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });

      $rootScope.$on('scrollDown', function() {
        setTimeout(function() {
          $(element).scrollTop($(element)[0].scrollHeight);
        }, 0);
      });
    }
  }
})

// functions to show message board posts and submit them
app.factory('messageBoardFactory', function($http){

    var showPosts = function(id){
        return $http({
          method: 'POST',
          url: '/api/messages/leagues',
          data: {id: id}
        })
        .then(function(posts){
          return posts;
        });
    };

    var submitPost = function(post){
        return $http({
          method: 'POST',
          url: '/api/messages',
          data: post
        })
        .then(function(members){
          return members;
        });
    };

    return {
      showPosts: showPosts,
      submitPost: submitPost,
    };
  })

app.factory('News', ['$http', function($http) {
  var getNews = function(userId, leagueId) {
    return $http({
      method: 'Get',
      url: '/api/tweets/'+leagueId+'/'+userId
    });
  };
  return {
    getNews: getNews
  };
}]);

app.factory('orderStatusFactory', function($http){

  var getOrders = function(data){
    return $http({
      method: 'POST',
      url: 'api/transactions/getorders',
      data: data,
      headers: {"Content-Type": "application/json;charset=utf-8"}
    })
    .then(function(orders){
      return orders.data;
    });
  }

  return {
    getOrders: getOrders
  }

})
app.factory('Portfolio', function($http){

  var buySell = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions',
      data: options
    }).then(function(data){
      return data;
    })
  }

  var limitOrder = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions/limitorder',
      data: options
    }).then(function(data){
      return data;
    })
  }

  var getStock = function(stockName){
    return $http({
      method: 'GET',
      url: '/api/stocks/'+stockName
    }).then(function(stock){
      return stock.data.query.results.quote;
    })
  }

  var getPortfolio = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/'+leagueId+'/'+userId
    }).then(function(portfolio){
      //console.log('User Account Info (incl. Balance)', portfolio.data);
      return portfolio.data;
    })
  }

  var getUserStocks = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    })
  }

  var updateUserStocks = function(leagueId, userId){
    return $http({
      method: 'PUT',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    });
  }

  return {
    getStock: getStock,
    buySell: buySell,
    getPortfolio: getPortfolio,
    getUserStocks: getUserStocks,
    updateUserStocks: updateUserStocks,
    limitOrder: limitOrder
  }
})


var app = angular.module('app');

app.factory('preLeagueFactory', function($http, $stateParams){

  var getName = function(leagueId){
    return $http({
      method: 'GET',
      url: '/api/leagues/'+leagueId,
    })
    .then( function (league) {
      return league.data.name;
    });
  }

  return {
    getName: getName
  }


})
var app = angular.module('app');

app.factory('symbolFactory', function($http){

  var getCompany = function(company){
    return $http({
      method: 'GET',
      url: '/api/symbols/'+company,
    })
    .then( function (data) {
      console.log(data)
      return data;
    });
  }

  return {
    getCompany: getCompany
  }

})
var app = angular.module('app');

app.factory('topicFactory', ['$http', function($http){

  var addNewReply = function(userReply){
    return $http({
      method: 'POST',
      url: '/api/topics',
      data: userReply
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  // add topicId back as an argument
  var showAllReplies = function(topicId){
    return $http({
      method: 'GET',
      url: '/api/topics/'+topicId
    })
    .then(function(replies){
      return replies;
    });
  }



  return {
    addNewReply: addNewReply,
    showAllReplies: showAllReplies
  };

}])
app.factory('transactionFactory', function ($http){

  var getleagueTransactions = function(arr) {
    return $http({
      method: 'Post',
      url: '/api/recentTransactions/',
      data: {'data':arr}
    });
  };
  return {
    getleagueTransactions: getleagueTransactions
  };
});

var app = angular.module('app');

app.controller('TopicController', ['$scope', 'topicFactory', '$stateParams', '$window', 'forumFactory', '$location', '$anchorScroll', function($scope, topicFactory, $stateParams, $window, forumFactory, $location, $anchorScroll){

  // functionality to show and hide reply form field
  $scope.replyClicked = false;

  $scope.reply = function(){
    $scope.replyClicked = true;
  };

  $scope.cancelReply = function(){
    $scope.replyClicked = false;
  };

  // functionality to generate a reply and post

  $scope.allReplies;
  $scope.topicReply = {};
  $scope.topicReply.topicId = $stateParams.topicId;
  $scope.topicReply.userName = $window.localStorage.getItem('com.tp.username');
  $scope.topicReply.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.topicReply.message = '';

  $scope.topicInfo;

  $scope.submitReply = function(reply){
    topicFactory.addNewReply(reply).then(function(err, res){
      if(err){console.log(err)}
    })
    .then(function(){
      $scope.topicReply.message = '';
      $scope.cancelReply();
      $scope.getAllReplies();
    });
  };

  $scope.getAllReplies = function(){
    topicFactory.showAllReplies($scope.topicReply.topicId).then(function(data){
      $scope.allReplies = data.data;
    });
  };

  $scope.getOneTopic = function(){
    forumFactory.getOneTopic($scope.topicReply.topicId).then(function(data){
      $scope.topicInfo = data.data[0];
    });
  };

  $scope.momentJS = function(time){
    return moment(time).fromNow();
  };

  $scope.lastPost = function(){
    $location.hash('last');
  };

  $scope.toTop = function(){
    $location.hash('top');
  };

  $scope.getOneTopic();
  $scope.getAllReplies();
  $anchorScroll();

}]);



app.controller('FaqsController', function(){



});
var app = angular.module('app')

app.controller('MainForumController', ['$scope', '$window', 'forumFactory', '$rootScope', '$location', '$anchorScroll','topicFactory', function($scope, $window, forumFactory, $rootScope, $location, $anchorScroll, topicFactory){

  $scope.sortLatest = 'createdAt';
  $scope.sortReverse = true;
  $scope.topic = {};
  $scope.topic.username = $window.localStorage.getItem('com.tp.username');
  $scope.topic.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.allTopics;

  $scope.openModal = function(){
    $('#createForumPost').openModal();
  };

  $scope.createTopic = function(topic){
    forumFactory.addNewTopic(topic).then(function(err, res){
      if(err){console.log(err)}
    }).then(function(){
      $scope.topic.title = '';
      $scope.topic.description = '';
      $('#createForumPost').closeModal();
      $scope.showAllTopics();
      $scope.goToTop();
    });
  };

  $scope.showAllTopics = function(){
    forumFactory.showAllTopics().then(function(data){
      $scope.allTopics = data.data;

      for(var i = 0; i < $scope.allTopics.length; i++){

        (function(index){
          $scope.allTopics[index].replies = 0;
          topicFactory.showAllReplies($scope.allTopics[index].id)
            .then(function(replies){
              console.log('#ofREPLIES: ', replies);
              $scope.allTopics[index].replies = replies.data.length;

            });
        })(i)
      }

    });
  };


  $scope.goToTop = function(){
    $location.hash('top');
    $anchorScroll();
  };

  $scope.showAllTopics();

}]);

  // $(document).ready(function(){

  // 	setTimeout(function(){
	 //    console.log(document.getElementById('widget-container'))
	 //    $('#widget-container').html('<script type="text/javascript" src="https://www.barchart.com/widget.js?uid=7a89c27aa42a40916668fe0d82edec22&widgetType=leaders&lbType=stock&widgetWidth=300&fontColor%5Blinks%5D=004376&font=1&tabs%5B%5D=active&tabs%5B%5D=gainers&tabs%5B%5D=losers&symbox=1&fields%5B%5D=name&fields%5B%5D=symbol&fields%5B%5D=last&fields%5B%5D=pctchange&displayChars="></script>');
	 //    // $('.widget-container').write('hey');
	 //  }, 2000);

  // });
app.controller('LeaderBoardController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'leaderBoardFactory', '$location', '$rootScope' ,function($scope, $window, $stateParams, DashboardFactory, leaderBoardFactory, $location, $rootScope){

  // members will be an object of each member in the league
  // containing name, portfolio value, and other stats
  // desired to go on the leaderboard
  $scope.members = [
    {
      username: 'Sonny',
      value: 15000,
      return: '10%',
      transactions: 25
    },
    {
      username: 'Ted',
      value: 9000,
      return: '20%',
      transactions: 45
    },
    {
      username: 'Devonte',
      value: 3567,
      return: '6%',
      transactions: 5
    }
  ];

  $scope.leagueId = $stateParams.leagueId;
  $scope.portfolios;
  $scope.leagueName;

  $scope.getLeaderBoard = function(){
    // this will call a factory function to grab http data from server and assign returned data to $scope.members;
    leaderBoardFactory.getPortfolios($scope.leagueId)
      .then(function(portfolios){
        var userId = $window.localStorage.getItem('com.tp.userId');
        var joined = false;
        for(var i=0; i<portfolios.length; i++){
          if(portfolios[i].UserId === Number(userId)) joined = true;
        }
        $scope.portfolios = portfolios;
        $scope.leagueName = portfolios[0].leaguename;
        $scope.code = portfolios[0].code;
        if(!joined) {
          $window.location.href = '/#/dashboard';
          Materialize.toast('You are not in the league.',1000);
        }
      });
  };

  $scope.getLeagueById = function(){
    DashboardFactory.getLeagueById($scope.leagueId).then(function(data){
      $scope.secretCode = data.code;
    });
  };

  $scope.getLeagueById();
  $scope.getLeaderBoard();
  // once we have league ID, call to initialize leaderboard
  //$scope.getLeaderBoard(leagueId);
  $rootScope.$on("PortfolioUpdate", function(){
    $scope.getLeaderBoard();
  });
}]);

app.controller('LeagueController', ['$scope', '$stateParams', 'DashboardFactory', function($scope, $stateParams, DashboardFactory){
  //Gets the league
  var leagueId = $stateParams.leagueId;

  // initialize a flag indicating that the league has not started yet
  $scope.hasStarted = false;
  $scope.hasEnded = false;
  // grab the current moment using moment.js
  var currentMoment = moment().utc();

  $scope.checkStart = function (league) {
    var start = moment(league.start).utc();
    if (currentMoment.isBefore(start)) {
      $scope.hasStarted = false;
    } else {
      $scope.hasStarted = true;
      // TODO: add this to the databse
    }
  };

  $scope.checkEnd = function (league) {
    var end = moment(league.end).utc();
    if (currentMoment.isAfter(end)) {
      $scope.hasEnded = true;
    } else {
      $scope.hasEnded = false;
      // TODO: add this to the databse
    }
  };

  $scope.checkTradingHours = function () {
    var tradingStart = moment().utc().hour(13).minute(30);
    var tradingEnd = moment().utc().hour(20);
    $scope.isBetweenTradingHours = currentMoment.isBetween(tradingStart, tradingEnd);
  };

  DashboardFactory.getLeagueById(leagueId)
    .then(function(league){
      $scope.league = league;
      // TODO: make this run conditionally
      // if (league.hasStarted === false ) {
      //   run the checkStart
      // }
      $scope.checkStart($scope.league);
      $scope.checkEnd($scope.league);
      if ($scope.hasStarted || !$scope.hasEnded) {
        $scope.checkTradingHours();
      }
    });


}]);

angular.module('app.leagueResults', [])

.controller('LeagueResultsController', function($scope, $stateParams, $window, leaderBoardFactory, DashboardFactory, Portfolio){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');

  // Getting the winner of the league
  leaderBoardFactory.getPortfolios(leagueId)
    .then(function(portfolios){
			var max = 0, winner;
			portfolios.forEach(function(portfolio){
				if (portfolio.balance + portfolio.portfolioValue > max){
					max = portfolio.balance + portfolio.portfolioValue;
					winner = portfolio;
				}
			});

			$scope.winner = winner;
   	});

  // Getting the current league
  DashboardFactory.getLeagueById(leagueId)
  	.then(function(league){
  		$scope.league = league;
  	});

  //Getting user stocks
  //updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions;

			var mostShares = 0 , mostStockShares;
			transactions.forEach(function(transaction){
				if (transaction.shares > mostShares){
					mostShares = transaction.shares;
					mostStockShares = transaction;
				}
			});
			$scope.mostShares = mostStockShares;
		});

});

var app = angular.module('app');

app.controller('MessageBoardController', function($scope, messageBoardFactory, $rootScope, $window, $stateParams){

  $scope.posts;

  $scope.userPost = {};
  $scope.userPost.name = $window.localStorage.getItem('com.tp.username');
  $scope.userPost.leagueId = $stateParams.leagueId;

  $scope.messageBoardPost = function(){

    messageBoardFactory.submitPost($scope.userPost).then(function(){

      messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
        var posts = posts;
        $scope.posts = posts.data;
        console.log(posts);
        $scope.userPost.message = '';
        $rootScope.$emit('scrollDown');
      });

    });
  };

  $scope.leagueId;


  var showPosts = function(){
    messageBoardFactory.showPosts($scope.userPost.leagueId).then(function(posts){
    var posts = posts;
    $scope.posts = posts.data;
  });
};

  showPosts();
  // $window.setInterval(showPosts, 1000);

});

app.controller('NewsController', ['$scope', '$window', '$stateParams', 'News', function($scope, $window, $stateParams, News){


  $scope.tweets = [];

  $scope.getTweets= function(){

    var leagueId = $stateParams.leagueId;
    var userId = $window.localStorage.getItem('com.tp.userId');
    $scope.tweets = [];
    News.getNews(userId, leagueId)
    .then(function (res){
      res.data.forEach(function(tweet){
        $scope.tweets.push({text : tweet.text, user : tweet.user, time: tweet.created_at});
      });

    });
  };
  //$scope.getTweets();
}]);

app.controller('orderStatusController', ['$scope', '$window', '$stateParams', 'orderStatusFactory', function($scope, $window, $stateParams, orderStatusFactory){

  $scope.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.leagueId = $stateParams.leagueId;

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

  $scope.openModal = function(){
    $('#modal2').openModal();
  };

  $scope.closeModal = function(){
    $('#modal2').closeModal();
  };

}]);

angular.module('app.portfolio', [])

.controller('PortfolioController', ['$scope', '$window', '$stateParams', 'Portfolio', '$rootScope', function($scope, $window, $stateParams, Portfolio, $rootScope){
	// MAKE A TRADE MODAL
	$scope.leagueId = $stateParams.leagueId;
	$scope.userId = $window.localStorage.getItem('com.tp.userId');
	$scope.fees = 10;
	$scope.estPrice = 0;
	$scope.action = false;
	$scope.singlePrice = 0;

	$rootScope.$on('symbolRetrieved', function(event, data){
		return $scope.chooseStock(data);
	});

	$scope.resetFields = function (){
		$scope.stock = undefined;
		$scope.stockAmount = '';
		$scope.stockInput = '';
		$scope.estPrice = '';
		$scope.singlePrice = '';
		$scope.total = '';
	};

	$scope.chooseStock = function(stockName){
		Portfolio.getStock(stockName).then(function(stock){
			if(!stock.Ask){
				Materialize.toast('Please enter a valid symbol!',3000);
			}
			else {
			$scope.stock = stock;
			$scope.estPrice = stock.Ask;
			$scope.singlePrice = stock.Ask;
		}
		});
		$scope.resetFields();
	};

	// Either buys a stock or sells it depending on selection
	$scope.performAction = function(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');
		var options = {
			symbol: $scope.stock.symbol,
			company: $scope.stock.Name,
			leagueId: leagueId,
			userId:  userId,
			shares: $scope.stockAmount,
			price: $scope.stock.Ask,
			marketPrice: $scope.stock.Ask,
			buysell: !$scope.action
		};
		// if selling stock, must own it and enough shares
		if (!options.buysell && !ableToSell()){
			return false;
		} else if (options.buysell && $scope.total > $scope.balance){
			Materialize.toast("Your balance isn't high enough to make this trade", 3000, 'rounded');
			return false;
		} else if (options.buysell && Number($scope.singlePrice) < Number($scope.stock.Ask)){
			options.price = $scope.singlePrice;
			options.executed = false;
			Portfolio.limitOrder(options).then(function(data){
			});
			Materialize.toast("Your limit order has been placed", 3000, 'rounded');
			$scope.resetFields();
			return false;
		} else {
			options.executed = true;
			Portfolio.limitOrder(options).then(function(data){
			});
			Portfolio.buySell(options).then(function(data){
				Materialize.toast('You traded '+options.shares+' shares in '+options.company, 3000, 'rounded');
				$scope.resetFields();
				updatePortfolio();
			});
		}
	};

	function ableToSell(){
		for (var i = 0; i < $scope.stocks.length; i++){
			if ($scope.stocks[i].symbol === $scope.stock.symbol){
				if ($scope.stockAmount <= $scope.stocks[i].shares){
					return true;
				} else {
					Materialize.toast('You are selling more shares in this company than you own', 3000, 'rounded');
					return false;
				}
			}
		}
		Materialize.toast('You do not own this share to sell', 3000, 'rounded');
		return false;
	}

	$scope.sellStock = function(stock){
    $scope.chooseStock(stock.symbol);
    $scope.action = true;

		//animation to scroll
		$('html, body').animate({
        scrollTop: $(".make-trades").offset().top
    }, 1500);
	};

	$scope.updateAmounts = function(){
		$scope.estPrice = $scope.stockAmount * $scope.singlePrice;
		$scope.total = $scope.estPrice + $scope.fees;
	};

	$scope.updateMarketPrice = function(){
			if ($scope.stocks.length > 0){
				Portfolio.updateUserStocks($scope.leagueId, $scope.userId).then(function(stocks){

				  if (stocks.error){
				  	Materialize.toast('Error updating market prices. Try again in a 30 seconds.', 5000, 'rounded');
				  } else {
				  	Materialize.toast('Market Price Updated', 3000, 'rounded');
				  	updatePortfolio();
				  }
				});
			}
		};

	// MY STOCKS MODAL
	updatePortfolio();
	// $scope.updateMarketPrice();

	function updatePortfolio(){
		var leagueId = $stateParams.leagueId;
		var userId = $window.localStorage.getItem('com.tp.userId');


		//updating user balance
		Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
		});

		//updating users purchased stocks
		Portfolio.getUserStocks(leagueId, userId).then(function(transactions){
			$scope.stocks = transactions;
            transactions.forEach(function(transaction){
              console.log(Math.round((transaction.marketPrice*transaction.shares)/$scope.portfolioValue*100),'&&&');
              transaction.percentage = Math.round((transaction.marketPrice*transaction.shares)/$scope.portfolioValue*100);
            });
			$scope.stocks = transactions;
		});



    $rootScope.$emit("PortfolioUpdate", {});
	}
}]);

app.controller('PortfolioChartController', ['$scope', 'Portfolio', '$stateParams', '$window', function($scope, Portfolio,$stateParams,$window){

$scope.data1 = {
		series: ['yo', 'yo1'],
		data: [{
			x: "Cash",
			y: [50],
			//tooltip: "this is tooltip"
		},
		{
			x:'Stocks',
			y:[50],
		}]
	};
	$scope.chartType = 'pie';

	$scope.config1 = {
		labels: true,
		click: function(d) {
			$scope.getBalance();
			Materialize.toast('Assets Updated!', 1000);
		},
		title: "Asset Allocation",
		legend: {
			display: true,
			position: 'right'
		},
		colors: ['#6baed6','#9ecae1'],
		innerRadius: 0
	};


$scope.getBalance = function (){
	var leagueId = $stateParams.leagueId;
	var userId = $window.localStorage.getItem('com.tp.userId');
    Portfolio.getPortfolio(leagueId, userId).then(function(portfolio){
			$scope.balance = portfolio.balance;
			$scope.portfolioValue = portfolio.portfolioValue;
			$scope.total = $scope.balance + $scope.portfolioValue;
			$scope.data1.data[0].y[0]=(Math.round($scope.balance/$scope.total*100));
			$scope.data1.data[1].y[0]=(Math.round($scope.portfolioValue/$scope.total*100));
		});

};
$scope.getBalance();

}]);

app.controller('PreLeagueController', ['$scope', '$stateParams', 'preLeagueFactory', function($scope, $stateParams, preLeagueFactory){

  $scope.leagueId = $stateParams.leagueId;
  $scope.leagueName;

  $scope.getLeagueName = function(){
    preLeagueFactory.getName($scope.leagueId)
      .then(function(name){
        $scope.leagueName = name;
      });
  };

  $scope.pre = false;
  $scope.suspended = true;

  $scope.getLeagueName();

  // this is the start date, time of the league
  $scope.date;


}]);

angular.module('app.profile', [])

.controller('ProfileController', ['$scope', '$window', '$stateParams', 'DashboardFactory', 'AccountFactory', function($scope, $window, $stateParams, DashboardFactory, AccountFactory){
	$scope.id = $stateParams.userId;
	$scope.username = $window.localStorage.getItem('com.tp.username');

	$scope.getUserLeagues = function () {
    DashboardFactory.getUserLeagues($scope.id)
      .then(function(portfolios){
        $scope.portfolios = portfolios;
      });
  };

  $scope.getLeaguesByOwnerId = function(){
    AccountFactory.getLeaguesByOwnerId($scope.id).then(function(data){
      $scope.leagues = data;
      console.log('leagues created', data);
    });
  };

  // This functions needs to be created
  $scope.getLeaguesWonById = function(){

  	$scope.leaguesWon = [];
  };

  $scope.getUser = function(){
    AccountFactory.getSingleUser($scope.id)
      .then(function(user){
        $scope.user = user;
        $scope.email = user.email;
        $scope.image = user.image || '../assets/img/no-avatar.png';
      });
  };

  $scope.getUser();

  $scope.getLeaguesWonById();
  $scope.getLeaguesByOwnerId();
  $scope.getUserLeagues();
}]);

var app = angular.module('app')

.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
})

.filter('negative', function () {
   return function (items) {
    if(items <1){
      return Math.abs(items);
    }
    else{
      return Math.abs(items);
    }
  };
})

.controller('recentTransactionsController', ['$scope', 'transactionFactory', '$stateParams', 'leaderBoardFactory', function ($scope, transactionFactory, $stateParams, leaderBoardFactory) {

  var leagueId = $stateParams.leagueId;

  $scope.portfolios =[];
  $scope.transactions = [];
  $scope.usernames = {};

  $scope.getleagueTransactions = function (arr) {
    	  $scope.transactions =[];
        transactionFactory.getleagueTransactions(arr)
        .then(function (transactions){

        		angular.forEach(transactions.data, function (transaction){

        			for(var k in $scope.usernames){
        				if(parseInt(k) === transaction.portfolioid){
        					transaction.portfolioid = $scope.usernames[k];
        				}
        			}
        			$scope.transactions.push(transaction);
        		});
        });
  };
  $scope.getPortfolios = function () {
  	leaderBoardFactory.getPortfolios(leagueId)
  	  .then(function (portfolios) {
  	  	portfolios.forEach(function (portfolio) {
  	  		var id = portfolio.id;
  	  		$scope.usernames[portfolio.id]= portfolio.username;
  	  		$scope.portfolios.push({'PortfolioId': portfolio.id});
  	  	});
        $scope.getleagueTransactions($scope.portfolios);
  	  });
  };
}]);

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

//signin signup controller
.controller('SigninController', ['$scope', '$window', 'Auth', '$rootScope', function($scope, $window, Auth, $rootScope){
  $scope.user = {};
  //$scope.loggedin = false;
  $scope.username;

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
  };

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
  };

  $scope.logout = function(user){
    $scope.loggedin = false;
    $window.localStorage.removeItem('com.tp');
    $window.localStorage.removeItem('com.tp.userId');
    $window.localStorage.removeItem('com.tp.username');
    $window.location.href = '/#/';
  };
}]);

app

  .factory('AccountFactory', function($http){

    var deleteAccount = function(userID){
      return $http({
        method: 'DELETE',
        url: 'api/users/',
        data: {id: userID},
        headers: {"Content-Type": "application/json;charset=utf-8"}
      })
      .then(function(user){
        console.log(user + ', successfully deleted');
      });
    };

    var editLogin = function(user){
      console.log(user.userId)
      return $http.put('api/users/'+user.userId, {
          id: user.userId,
          email: user.email,
          password: user.pass,
          oldpassword: user.oldpass
        }
      )
      .then(function(user){
        return user;
      })
    };

    var getSingleUser = function(userID){
      return $http({
        method: 'POST',
        url: 'api/users/getuser',
        data: {id: userID},
      })
      .then(function(user){
        return user.data;
      });
    };


    var getLeaguesByOwnerId = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/owner/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    var editOneLeague = function(id, data){
      return $http({
        method: 'PUT',
        url: '/api/leagues/'+id,
        data: data
      })
      .then(function(league){

      });
    }

    var deleteLeagueById = function(id, data){
      return $http({
        method: 'DELETE',
        url: '/api/leagues/'+id
      })
      .then(function(data){
        console.log(data);
      });
    }

    var profileImage = function(data){
      console.log(data);
      return $http({
        method: 'POST',
        url: 'api/users/profileimage',
        data: data,
      })
      .then(function(user){
        return user.data;
      });
    }

    return {
      deleteAccount: deleteAccount,
      editLogin: editLogin,
      getSingleUser: getSingleUser,
      getLeaguesByOwnerId: getLeaguesByOwnerId,
      editOneLeague: editOneLeague,
      deleteLeagueById: deleteLeagueById,
      getSingleUser: getSingleUser,
      profileImage: profileImage
    };

  })
app.factory('Auth', function($http, $location, $window){

  var createuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users',
      data: user
    })
    .then(function(data){
      return data.data;
    });
  };

  var loginuser = function(user){
    return $http({
      method: 'POST',
      url: '/api/users/signin',
      data: user
    })
    .then(function(data){
      return data.data;
    })
  }

  var isAuth = function() {
    return !!$window.localStorage.getItem('com.tp');
  };

  return {
    isAuth: isAuth,
    createuser: createuser,
    loginuser: loginuser
  };

});
app
  .factory('BadgeFactory', ['$http', function ($http) {
    var getBadges = function(userId){
      return $http({
        method: 'POST',
        url: '/api/badges/getBadges',
        data: {userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };
    var getPossibleBadges = function(userId){
      return $http({
        method: 'POST',
        url: '/api/badges/possibleBadges',
        data: {userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    var postBadge = function(userId, badge){
      return $http({
        method: 'POST',
        url: '/api/badges',
        data: {badge: badge, userId: userId}
      })
      .then(function(badges){
        return badges;
      });
    };

    return {
      getBadges: getBadges,
      getPossibleBadges: getPossibleBadges,
      postBadge: postBadge
    };
  }]);

app

  .factory('DashboardFactory', function($http){

    var addLeague = function(league){
      return $http({
        method: 'POST',
        url: '/api/leagues',
        data: league
      })
      .then( function(league){
        return league.data;
      });
    };

    var joinLeague = function(leagueId, userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/joinleague',
        data: { leagueId: leagueId,
                userId: userId }
      })
      .then( function(data){
        return data;
      });
    };

    var getUserLeagues = function(userId){
      return $http({
        method: 'POST',
        url: '/api/leagues/userleague',
        data: {userId: userId}
      })
      .then( function (portfolios) {
        // TODO: Structure this appropriately once you have the exact route
        return portfolios.data;
      }
      );
    };

    var getAvailLeagues = function(){
      return $http({
        method: 'GET',
        url: '/api/leagues/'
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    };

    var getLeagueById = function(id){
      return $http({
        method: 'GET',
        url: '/api/leagues/'+id
      })
      .then(function(leagues){
        // TODO: Structure this appropriately once you have the exact route
        return leagues.data;
      });
    }

    var getPortfolios = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: leagueID}
      })
      .then(function(portfolios){
        return portfolios.data;
      });
    };

    return {
      addLeague: addLeague,
      getUserLeagues: getUserLeagues,
      getAvailLeagues: getAvailLeagues,
      joinLeague: joinLeague,
      getLeagueById: getLeagueById,
      getPortfolios: getPortfolios
    };

  })

var app = angular.module('app');

var app = angular.module('app');

app.factory('forumFactory', ['$http', function($http){

  var addNewTopic = function(topic){
    return $http({
      method: 'POST',
      url: '/api/forum',
      data: topic
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  var showAllTopics = function(){
    return $http({
      method: 'GET',
      url: '/api/forum',
    })
    .then(function(topics){
      return topics;
    });
  }

  var getOneTopic = function(id){
    console.log('SERVICE: ', id)
    return $http({
      method: 'POST',
      url: '/api/forum/topic',
      data: {id: id}
    })
  }


  return {
    addNewTopic: addNewTopic,
    showAllTopics: showAllTopics,
    getOneTopic: getOneTopic
  };


}])
app

  .factory('leaderBoardFactory', function($http){

    var getPortfolios = function(leagueID){
      return $http({
        method: 'POST',
        url: '/api/leagues/getusers',
        data: {leagueId: leagueID}
      })
      .then(function(portfolios){
        return portfolios.data;
      });
    };

    return {
      getPortfolios: getPortfolios
    };

  })
var app = angular.module('app');
// to maintain scrollbar at bottom when new message is posted
app.directive('scrollDirective', function ($rootScope) {
  return {
    scope: {
      scrollDirective: '='
    },
    link: function (scope, element) {
      scope.$watchCollection('scrollDirective', function (newValue) {
        if (newValue) {
          $(element).scrollTop($(element)[0].scrollHeight);
        }
      });

      $rootScope.$on('scrollDown', function() {
        setTimeout(function() {
          $(element).scrollTop($(element)[0].scrollHeight);
        }, 0);
      });
    }
  }
})

// functions to show message board posts and submit them
app.factory('messageBoardFactory', function($http){

    var showPosts = function(id){
        return $http({
          method: 'POST',
          url: '/api/messages/leagues',
          data: {id: id}
        })
        .then(function(posts){
          return posts;
        });
    };

    var submitPost = function(post){
        return $http({
          method: 'POST',
          url: '/api/messages',
          data: post
        })
        .then(function(members){
          return members;
        });
    };

    return {
      showPosts: showPosts,
      submitPost: submitPost,
    };
  })

app.factory('News', ['$http', function($http) {
  var getNews = function(userId, leagueId) {
    return $http({
      method: 'Get',
      url: '/api/tweets/'+leagueId+'/'+userId
    });
  };
  return {
    getNews: getNews
  };
}]);

app.factory('orderStatusFactory', function($http){

  var getOrders = function(data){
    return $http({
      method: 'POST',
      url: 'api/transactions/getorders',
      data: data,
      headers: {"Content-Type": "application/json;charset=utf-8"}
    })
    .then(function(orders){
      return orders.data;
    });
  }

  return {
    getOrders: getOrders
  }

})
app.factory('Portfolio', function($http){

  var buySell = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions',
      data: options
    }).then(function(data){
      return data;
    })
  }

  var limitOrder = function(options){
    return $http({
      method: 'POST',
      url: '/api/transactions/limitorder',
      data: options
    }).then(function(data){
      return data;
    })
  }

  var getStock = function(stockName){
    return $http({
      method: 'GET',
      url: '/api/stocks/'+stockName
    }).then(function(stock){
      return stock.data.query.results.quote;
    })
  }

  var getPortfolio = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/'+leagueId+'/'+userId
    }).then(function(portfolio){
      //console.log('User Account Info (incl. Balance)', portfolio.data);
      return portfolio.data;
    })
  }

  var getUserStocks = function(leagueId, userId){
    return $http({
      method: 'GET',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    })
  }

  var updateUserStocks = function(leagueId, userId){
    return $http({
      method: 'PUT',
      url: '/api/portfolios/stocks/'+leagueId+'/'+userId
    }).then(function(transactions){
      //onsole.log('User stocks', transactions.data)
      return transactions.data;
    });
  }

  return {
    getStock: getStock,
    buySell: buySell,
    getPortfolio: getPortfolio,
    getUserStocks: getUserStocks,
    updateUserStocks: updateUserStocks,
    limitOrder: limitOrder
  }
})


var app = angular.module('app');

app.factory('preLeagueFactory', function($http, $stateParams){

  var getName = function(leagueId){
    return $http({
      method: 'GET',
      url: '/api/leagues/'+leagueId,
    })
    .then( function (league) {
      return league.data.name;
    });
  }

  return {
    getName: getName
  }


})
var app = angular.module('app');

app.factory('symbolFactory', function($http){

  var getCompany = function(company){
    return $http({
      method: 'GET',
      url: '/api/symbols/'+company,
    })
    .then( function (data) {
      console.log(data)
      return data;
    });
  }

  return {
    getCompany: getCompany
  }

})
var app = angular.module('app');

app.factory('topicFactory', ['$http', function($http){

  var addNewReply = function(userReply){
    return $http({
      method: 'POST',
      url: '/api/topics',
      data: userReply
    })
    .then(function(err, res){
      if(err){console.log(err);}
    });
  };

  // add topicId back as an argument
  var showAllReplies = function(topicId){
    return $http({
      method: 'GET',
      url: '/api/topics/'+topicId
    })
    .then(function(replies){
      return replies;
    });
  }



  return {
    addNewReply: addNewReply,
    showAllReplies: showAllReplies
  };

}])
app.factory('transactionFactory', function ($http){

  var getleagueTransactions = function(arr) {
    return $http({
      method: 'Post',
      url: '/api/recentTransactions/',
      data: {'data':arr}
    });
  };
  return {
    getleagueTransactions: getleagueTransactions
  };
});

var app = angular.module('app');

app.controller('TopicController', ['$scope', 'topicFactory', '$stateParams', '$window', 'forumFactory', '$location', '$anchorScroll', function($scope, topicFactory, $stateParams, $window, forumFactory, $location, $anchorScroll){

  // functionality to show and hide reply form field
  $scope.replyClicked = false;

  $scope.reply = function(){
    $scope.replyClicked = true;
  };

  $scope.cancelReply = function(){
    $scope.replyClicked = false;
  };

  // functionality to generate a reply and post

  $scope.allReplies;
  $scope.topicReply = {};
  $scope.topicReply.topicId = $stateParams.topicId;
  $scope.topicReply.userName = $window.localStorage.getItem('com.tp.username');
  $scope.topicReply.userId = $window.localStorage.getItem('com.tp.userId');
  $scope.topicReply.message = '';

  $scope.topicInfo;

  $scope.submitReply = function(reply){
    topicFactory.addNewReply(reply).then(function(err, res){
      if(err){console.log(err)}
    })
    .then(function(){
      $scope.topicReply.message = '';
      $scope.cancelReply();
      $scope.getAllReplies();
    });
  };

  $scope.getAllReplies = function(){
    topicFactory.showAllReplies($scope.topicReply.topicId).then(function(data){
      $scope.allReplies = data.data;
    });
  };

  $scope.getOneTopic = function(){
    forumFactory.getOneTopic($scope.topicReply.topicId).then(function(data){
      $scope.topicInfo = data.data[0];
    });
  };

  $scope.momentJS = function(time){
    return moment(time).fromNow();
  };

  $scope.lastPost = function(){
    $location.hash('last');
  };

  $scope.toTop = function(){
    $location.hash('top');
  };

  $scope.getOneTopic();
  $scope.getAllReplies();
  $anchorScroll();

}]);

app.controller('SymbolController', ['$scope', '$http', 'symbolFactory', 'Portfolio', '$rootScope', function($scope, $http, symbolFactory, Portfolio, $rootScope){

  $scope.stockName;

  $scope.results=[];
  $scope.getStock = function(stock){
   $scope.results=[];
   var filter =[];
   var symbol;
    symbolFactory.getCompany(stock).then(function(data){
      var sym = data.data.ResultSet.Result;
      for(var j=0;j<sym.length;j++){
         if(sym[j].exchDisp === 'NYSE' || sym[j].exchDisp === 'NASDAQ'){
           filter.push(sym[j]);
         }
      }
      if(!filter.length){
        Materialize.toast('Company could not be found on NYSE or NASDAQ! Check for spaces and punctuation', 5000);
      }

      for(var i=0;i<filter.length;i++){
        $scope.results.push({'symbol' : filter[i].symbol, 'name': filter[i].name});
        }
      $scope.stockName = '';
    });

  };

  $scope.openModal = function(){
    $('#modal1').openModal();
  };

  $scope.closeModal = function(){
    $('#modal1').closeModal();
  };


  $scope.populate = function(symbol){
    $rootScope.$emit('symbolRetrieved', symbol);
    $scope.closeModal();
  };

}]);


