(function(){

  'use strict';

  var app = angular.module('app', ['ngMaterial', 'ui.router']);

  app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

      .state('signin', {
        url: '/',
        controller: 'SigninController',
        controllerAs: 'signin'
        templateUrl: 'signin/signin.html'
      })

      .state('lobby', {
        url: '/lobby',
        controller: 'LobbyController',
        controllerAs: 'lobby'
        templateUrl: 'lobby/lobby.html'

      })

      .state('league', {
        url: '/league/{id}',
        controller: 'LeagueController',
        controllerAs: 'league',
        templateUrl: 'league/league.html'
        resolve: {
          activities: function(leagueService){
            return leagueService.getLeague();
          }
        }
      })

      .state('portfolio', {
        url: '/portfolio',
        controller: 'PortfolioController',
        controllerAs: 'portfolio'
        templateUrl: 'portfolio/portfolio.html'

      })

      .state('faqs', {
        url: '/faqs',
        controller: 'FaqsController',
        controllerAs: 'faqs'
        templateUrl: 'faqs/faqs.html'

      })

      .state('account', {
        url: '/account',
        controller: 'AccountController',
        controllerAs: 'account'
        templateUrl: 'account/account.html'

      })

  }]);

}());