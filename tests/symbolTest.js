describe('SymbolController', function () {
  var $scope, $rootScope, createController, Portfolio, $httpBackend, symbolFactory;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    Portfolio = $injector.get('Portfolio');
    symbolFactory = $injector.get('symbolFactory')
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('SymbolController', {
        $scope: $scope,
        Portfolio: Portfolio,
        symbolFactory: symbolFactory
      });
    };
    createController();
  }));

  it('should have a stockName property on the $scope', function() {
    expect($scope.stockName).toBeUndefined();
  });

  it('should have a results property on the $scope', function() {
    expect($scope.results).toBeDefined();
  });

  it('should have results array of length 0', function() {
    expect($scope.results.length).toEqual(0);
  });

});
