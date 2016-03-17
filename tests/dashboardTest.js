describe('DashboardController', function () {

  var $controllerConstructor;
  var scope;
  var mockLeaguesData;

  // loads the app into the test
  beforeEach(module('app'));

  beforeEach(inject(function ($controller, $rootScope) {
    $controllerConstructor = $controller;
    scope = $rootScope.$new();
    console.log(scope.Scope,'sope')
    mockLeaguesData = sinon.stub({getAvailLeagues: function () {}})//creates object that looks like this
  }));


  it('should show all leagues available for the user to join', function () {
    
    var mockLeagues = {};
    mockLeaguesData.getAvailLeagues.returns(mockLeagues);
    // injects the specific controller and necessary dependencies
    // $controllerConstructor('DashboardController', {'$scope': scope, });
    //var email =''; .calledwith(email)
    $controllerConstructor('DashboardController', 
      {'$scope': scope, 'DashboardFactory': mockLeaguesData})

    expect(scope.leagues).toBe(mockLeagues)

  });

});
