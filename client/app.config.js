
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

      .state('watchlist', {
        url: '/watchlist',
        authenticate: true,
        controller: 'WatchlistController',
        templateUrl: 'watchlist/watchlist.html'
      })

      .state('ticker',{
        url:'/ticker',
        controller: 'tickerController',
        templateUrl:'ticker/ticker.html'
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

      .state('analysis', {
        url: '/analysis',
        controller: 'AnalysisController',
        templateUrl: 'analysis/analysis.html'
      })

      .state('forum', {
        url: '/forum',
        authenticate: true,
        controller: 'MainForumController',
        templateUrl: 'forum/main.html'
      })

      .state('messages', {
        url: '/messages',
        authenticate: true,
        controller: 'MessagesController',
        templateUrl: 'messages/messages.html'
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
