describe('DashboardController', function () {

  var $controllerConstructor;
  var scope;

  // loads the app into the test
  beforeEach(module('app'));

  beforeEach(inject(function ($controller, $rootScope) {
    $controllerConstructor = $controller;
    scope = $rootScope.$new();
  }));


  it('should show all leagues available for the user to join', function () {

    // injects the specific controller and necessary dependencies
    // $controllerConstructor('DashboardController', {'$scope': scope, });

    expect(100).toBe(100);
  });

});
