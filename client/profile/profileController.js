angular.module('app.profile', [])

.controller('ProfileController', ['$scope', function ($scope) {

  $scope.leagues = [{name:"league1", userRank: 2, percentChange: -1.3, gainLoss: '123.00', totalValue: 14000, changeYesterday: 2.5}, {name:"league2", userRank: 17, percentChange: 15, gainLoss: '2000', totalValue: 9888, changeYesterday: 2.5}, {name:"league3", userRank: 1, percentChange: 2.5, gainLoss: '12.00', totalValue: 9012, changeYesterday: 2.5}];
  $scope.portfolios = [];
  //Setting up some basic dummy data for the leagues


  $scope.getProfileLeagues = function () {
    // TODO: this will connect to a factory to pull leagues
  }

  $scope.getProfilePortfolios = function () {
    // TODO: this will connect to a factory to pull user portfolios
  }

}])
