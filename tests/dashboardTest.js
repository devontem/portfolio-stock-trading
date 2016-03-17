describe('DashboardController', function () {

  var $controllerConstructor;
  var scope;
  var mockLeaguesData;

  // loads the app into the test
  beforeEach(module('app'));

  beforeEach(inject(function ($controller, _$rootScope_, $q) {
    $controllerConstructor = $controller;
    $rootScope = _$rootScope_;
    DashboardFactory = {
      getAvailLeagues: function () {}
    };

    var deferred = $q.defer();
    deferred.resolve('somevalue');

    spyOn(DashboardFactory, 'getAvailLeagues').and.returnValue(deferred.promise);
  }));

  it('should return all leagues available to join', function () {
    var result;

    DashboardFactory.getAvailLeagues().then(function (leagues) {
      console.log(leagues);
      result = leagues;
    });

    // $rootScope.apply();

    expect(result).toBe('somevalue');
  });


  // it('should allow a user to add a league', function () {
  //
  //   var
  //
  //   // injects the specific controller and necessary dependencies
  //   $controllerConstructor('DashboardController', {'$scope': scope, 'DashboardFactory': mockLeagueData });
  //
  //   expect($scope.addLeague).toBe()
  //
  // });

});
