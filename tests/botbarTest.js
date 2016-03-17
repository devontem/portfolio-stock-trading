describe('BotBarController', function () {
  var $scope, $rootScope, createController, Portfolio, $httpBackend;

  // using angular mocks, we can inject the injector
  // to retrieve our dependencies
  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    Portfolio = $injector.get('Portfolio');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('BotBarController', {
        $scope: $scope,
        Portfolio: Portfolio
      });
    };
    createController();
  }));

  it('should have a hasSearched property on the $scope', function() {
    expect($scope.hasSearched).toBe(false);
  });

  it('should have a hasSearched property on the $scope', function() {
    expect($scope.hasSearched).toBe(false);
  });



  // it('should have a getLinks method on the $scope', function () {
  //   createController();
  //   expect($scope.getLinks).to.be.a('function');
  // });
  // it('should call getLinks() when controller is loaded', function () {
  //   var mockLinks = [{},{},{}];
  //   $httpBackend.expectGET("/api/links").respond(mockLinks);
  //   createController();
  //   $httpBackend.flush();
  //   expect($scope.data.links).to.eql(mockLinks);
  // });
});
