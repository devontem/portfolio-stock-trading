var app = angular.module('app', ['ui.router', 'app.profile', 'app.portfolio']);

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

      .state('profile', {
        url: '/profile',
        controller: 'ProfileController',
        controllerAs: 'profile',
        templateUrl: 'profile/profile.html'

      })

      .state('league', {
        url: '/league',
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
/*          'news@league': {
            controller: 'NewsController',
            controllerAs: 'news',
            templateUrl: 'news/news.html'
          },
          // message board view within league page
          'messageboard@league': {
            controller: 'MessageBoardController',
            controllerAs: 'messageboard',
            templateUrl: 'messageboard/messageboard.html'
          }*/
        }

      })

      // .state('portfolio', {
      //   url: '/portfolio',
      //   controller: 'PortfolioController',
      //   controllerAs: 'portfolio',
      //   templateUrl: 'portfolio/portfolio.html'

      // })

      .state('faqs', {
        url: '/faqs',
        controller: 'FaqsController',
        controllerAs: 'faqs',
        templateUrl: 'faqs/faqs.html'

      })

      .state('account', {
        url: '/account',
        controller: 'AccountController',
        controllerAs: 'account',
        templateUrl: 'account/account.html'

      })

      // .state('leaderboard', {
      //   url: '/leaderboard',
      //   controller: 'LeaderBoardController',
      //   controllerAs: 'leaderboard',
      //   templateUrl: 'leaderboard/leaderboard.html'
      // })

  }]);
