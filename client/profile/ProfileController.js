angular.module('app.profile', [])

.controller('ProfileController', ['$scope', '$window', '$stateParams', 'LeagueInvite', 'DashboardFactory', 'AccountFactory', 'DirectMessage', function($scope, $window, $stateParams, LeagueInvite, DashboardFactory, AccountFactory, DirectMessage){
	$scope.id = $stateParams.userId;
	$scope.username = $window.localStorage.getItem('com.tp.username');

	$scope.getUserLeagues = function () {
    DashboardFactory.getUserLeagues($scope.id)
      .then(function(portfolios){
        $scope.portfolios = portfolios;
      });
  };

  $scope.getLeaguesByOwnerId = function(){
    AccountFactory.getLeaguesByOwnerId($scope.id).then(function(data){
      $scope.leagues = data;
    });
  };

  // This functions needs to be created
  $scope.getLeaguesWonById = function(){
  	$scope.leaguesWon = [];
  };

  $scope.getUser = function(){
    AccountFactory.getSingleUser($scope.id)
      .then(function(user){
        $scope.user = user;
        $scope.email = user.email;
        $scope.image = user.image || '../assets/img/no-avatar.png';
      });
  };

  $scope.sendMessage = function(){
    DirectMessage.setSendTo($scope.user);
    $window.location.href = '/#/messages';
  }

  $scope.getUser();

  $scope.getLeaguesWonById();
  $scope.getLeaguesByOwnerId();
  $scope.getUserLeagues();


  //League Invite Logic
  $scope.userid = $window.localStorage.getItem('com.tp.userId');
  $scope.getVisitorLeagues = function () {
    DashboardFactory.getUserLeagues($scope.userid)
      .then(function(portfolios){
        $scope.visitorPortfolios = portfolios;
      });
  };
  $scope.getVisitorLeagues();

  $scope.leagueInvites = [];

  $scope.toggleInvite = function(league){
    // if deselecting, remove
    var index = $scope.findIndex(league.leagueId)

    if (index > -1){
      $scope.leagueInvites.splice(index, 1);
    } else {
      var invite = {};
      invite.receiverId = $scope.id;
      invite.leaguename = league.leaguename;
      invite.leagueId = league.leagueId;
      invite.end = league.endDate;
      invite.UserId = $scope.userid;
      invite.read = false;
      invite.username = league.username;

      $scope.leagueInvites.push(invite);
    }
  }

  $scope.isSelected = function(leagueId){
    for (var key in $scope.leagueInvites){
      if ($scope.leagueInvites[key].leagueId === leagueId){
        return true;
      }
    }
    return false;
  }

  $scope.findIndex = function(leagueId){
    for (var i = 0 ; i< $scope.leagueInvites.length; i++){
      if ($scope.leagueInvites[i].leagueId == leagueId){
        return i;
      }
    }
    return -1;
  }

  $scope.sendInvite = function(){
    if (!$scope.leagueInvites.length){
      Materialize.toast("Please select leagues before sending.", 3000);
      return false;
    }
    console.log('sending to', $scope.userid, $stateParams.userId)
    LeagueInvite.sendInvite($scope.userid, $stateParams.userId, $scope.leagueInvites).then(function(data){
      console.log('INVITES SENT ')
      $scope.leagueInvites = [];
    })    
  }

  // League Invite module initialization
   $(document).ready(function(){
      // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
      $('.modal-trigger').leanModal();
    });
}]);
