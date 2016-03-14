var app = angular.module('app', ['ui.router', 'app.dashboard', 'app.portfolio', 'app.botbar']);

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      .state('signin', {
        url: '/',
        controller: 'SigninController',
        controllerAs: 'signin',
        templateUrl: 'signin/signin.html'
      })

      .state('lobby', {
        url: '/lobby',
        controller: 'LobbyController',
        controllerAs: 'lobby',
        templateUrl: 'lobby/lobby.html'

      })

      .state('dashboard', {
        url: '/dashboard',
        controller: 'DashboardController',
        controllerAs: 'dashboard',
        templateUrl: 'dashboard/dashboard.html'

      })

      .state('league', {
        url: '/leagues/:leagueId',
        views: {
          /*main view of the entire league template*/
          '': {
            templateUrl: 'league/league.html'
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

          'messageboard@league': {
            controller: 'MessageBoardController',
            templateUrl: 'messageboard/messageboard.html'
          },

          'preleague@league': {
            controller: 'PreLeagueController',
            templateUrl: 'preleague/preleague.html'
          }
        }
      })
  }]);
