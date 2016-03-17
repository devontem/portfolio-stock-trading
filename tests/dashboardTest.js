describe('DashboardController', function () {
  var $scope, $rootScope, createController, DashboardFactory, $httpBackend;

  var $controllerConstructor;
  var scope;
  var mockLeaguesData;

  // loads the app into the test
  beforeEach(module('app'));
  beforeEach(inject(function($injector) {

    // mock out our dependencies
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    DashboardFactory = $injector.get('DashboardFactory');
    $scope = $rootScope.$new();

    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('DashboardController', {
        $scope: $scope,
        DashboardFactory: DashboardFactory
      });
    };
  }));

  it('should have a current tab property on the $scope', function() {
    createController();
    expect($scope.currentTab).toBe('user');
  });

  it('should have a showToJoin method on the $scope', function() {
    createController();
    expect($scope.showToJoin).toBeDefined('user');
    expect(typeof $scope.showToJoin).toBe('function');
  });

  it('invoking $scope.showToJoin should change the $scope.currentTab to "toJoin"', function() {
    createController();
    $scope.showToJoin();
    expect($scope.currentTab).toBe('toJoin');
  });

  it('invoking $scope.showUserLeagues should change the $scope.currentTab to "user"', function() {
    createController();
    $scope.showToJoin();
    $scope.showUserLeagues();
    expect($scope.currentTab).toBe('user');
  });

  it('invoking $scope.toggleAdd should change the $scope.showAdd value', function() {
    createController();
    $scope.toggleAdd();
    expect($scope.showadd).toBe(true);
    $scope.toggleAdd();
    expect($scope.showadd).toBe(false);
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
