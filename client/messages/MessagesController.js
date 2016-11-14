app

.controller('MessagesController', ['$scope', '$window', '$rootScope', 'DashboardFactory', 'LeagueInvite', 'DirectMessage', function($scope, $window, $rootScope, DashboardFactory, LeagueInvite, DirectMessage){
  $scope.username = $window.localStorage.getItem('com.tp.username');
  $scope.id = $window.localStorage.getItem('com.tp.userId');
  $scope.sendTo = null;
  $scope.tab = "inbox";

  $scope.changeTab = function(view){
  	$scope.tab = view;
  };

	$scope.sendMessage = function(){
		if (!$scope.sendTo){
			Materialize.toast('Must select somebody to send message to', 4000);
			return;
		}

		// RecipientId's key is 'recipientId' if from left panel, 'id' if from profiles page
		var recipientId = $scope.sendTo.recipientId == $scope.id ? $scope.sendTo.UserId : $scope.sendTo.recipientId;

		var msg = {};
		msg.senderUsername = $scope.username;
		msg.message = $scope.input;

		DirectMessage.sendMessage($scope.id, recipientId, msg).then(function(){
			console.log('Message Sent', msg);
			$scope.input = "";
			updateMessageCenter();
		});
	};

	 function getMessagesBetween(){
	 	// RecipientId's key is 'recipientId' if from left panel, 'id' if from profiles page
	 	$scope.recipientId = $scope.sendTo.recipientId == $scope.id ? $scope.sendTo.UserId : $scope.sendTo.recipientId;

	 	// console.log('Sending from: ', $scope.id, 'to: ', $scope.recipientId)
		DirectMessage.getMessagesBetween($scope.id, $scope.recipientId).then(function(messages){
			$scope.messages = messages;

			// set all messages as read once retrieved
			// DirectMessage.markAllMessagesReadBetween($scope.id, $scope.recipientId).then(function(){

				//refresh inbox
				getOpenAndUnreadMessages();
			// })

			// Scrolls the chat to the bottom
			setTimeout(function(){
				$(".messages-content").scrollTop($(".messages-content")[0].scrollHeight);
			}, 20);
		});
	}

	function getOpenAndUnreadMessages(){
		var counter = 0;
		DirectMessage.getOpenAndUnreadMessages($scope.id).then(function(data){
			//if current user was last person to send message, set message thread status to be read
			data = data.map(function(message){
				if ($scope.id == message.UserId){
					message.read = true;
					return message;
				} else if (!!!message.read){
					//if a message is unread, adds it to the counter
					counter++;
				}
				return message;
			});
			// only update it ng-model if value changes
      if (counter !== $scope.unreadMessages){
        $scope.unreadMessages = counter;
      }

		  $scope.unreadOpenMessages = data;
		});
	}

	$scope.selectSendTo = function(user, idx){
		$scope.sendTo = user;
		$scope.currentTab = idx;

		//when opening thread, mark most recent message as read
		if($scope.sendTo.recipientId == $scope.id){
			var messageId = $scope.sendTo.id;
			DirectMessage.markMessageReadById(messageId).then(function(){
				// console.log('Most recent message marked read!');
			});
		}
		getMessagesBetween();
	};

	function updateMessageCenter(){
		getOpenAndUnreadMessages();
		getInvitesByUserId();

		// if a chat is open, it refreshes for new messages
		if ($scope.sendTo){
			getMessagesBetween();
		}
	}

	$scope.joinLeague = function (leagueId) {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.joinLeague(leagueId, userId)
      .then(function(){
        $window.location.href = '/#/leagues/'+leagueId.toString();
        $rootScope.$emit('newleague');
      });
  };

  $scope.getUserLeagues = function () {
    var userId = $window.localStorage.getItem('com.tp.userId');
    DashboardFactory.getUserLeagues(userId)
      .then(function(portfolios){
        $scope.portfolios = portfolios;

        for(var i = 0; i < $scope.portfolios.length; i++){

          (function(index){
            $scope.portfolios[index].endDate = '';
            DashboardFactory.getLeagueById($scope.portfolios[index].id)
              .then(function(league){
                $scope.portfolios[index].endDate = league.end;
              });
          })(i);
        }
      });
  };

  $scope.getUserLeagues();

	function getInvitesByUserId(){
    LeagueInvite.getInvitesByUserId($scope.id).then(function(data){
      $scope.invites = data;

      // updating counter
      var counter = 0;
	    $scope.invites.forEach(function(invite){
	    	if (!invite.read) {
          counter++;
        }
	    });
	    $scope.unreadInvites = counter;
    });
  }

  $scope.openInvite = function(invite){

  	swal({title: "Join "+invite.leaguename+"?",
  				text: invite.username+" wants you to join this league with them!",
  				type: "info",
  				showCancelButton: true,
  				confirmButtonColor: "#DD6B55",
  				cancelButtonText: "Decline",
  				confirmButtonText: "Accept",
  				confirmButtonColor: '#9ccc65',
  				closeOnConfirm: false }, function(){


  					//checks to see if user is already in the league
  					for (var i = 0; i < $scope.portfolios.length; i++){
  						if ($scope.portfolios[i].leagueId == invite.leagueId){
  							swal("Cannot Join", "You're already in this league!", "error");
  							return false;
  						}
  					}

  					// joining the league
  					$scope.joinLeague(invite.leagueId);
  					swal("Joined!", "You are now apart of this league!", "success");
  				});

  	// changes that message to read
		LeagueInvite.markRead(invite.id).then(function(){
			getInvitesByUserId();
		});
  };

  getInvitesByUserId();

	// On page load fetches already open conversations
	DirectMessage.getOpenAndUnreadMessages($scope.id).then(function(data){
			var counter = 0;
			//if current user was last person to send message, set message thread status to be read
			data = data.map(function(message){
				if ($scope.id == message.UserId){
					message.read = true;
					return message;
				} else if (!!!message.read){
					//if last message was not send by the user && is unread, adds it to the counter
					counter++;
				}
				return message;
			});
			// only update it's ng-model if value changes
      if (counter !== $scope.unreadMessages){
        $scope.unreadMessages = counter;
      }

		  $scope.unreadOpenMessages = data;

			//Setting who to send to if redirected from profile page
			var user = DirectMessage.getSendTo();

			//if the value exists (aka was sent from a profile page)
			if (user){
				$scope.sendTo = user;
				// if coming from profile page, fixes the key to match DirectMessages format
				$scope.sendTo.recipientId = user.id;
				$scope.sendTo.recipientUsername = user.username;

				// // if a previous conversation has already been started between users, open it
				// for (var i = 0; i < $scope.unreadOpenMessages.length; i++){

				// 	// setting the recipientId based on if the last message was sent or received
				// 	var recipientId = ($scope.unreadOpenMessages[i].recipientId == $scope.id ? $scope.unreadOpenMessages[i].UserId : $scope.unreadOpenMessages[i].recipientId )

				// 	if ($scope.unreadOpenMessages[i].recipientId == recipientId){
				// 		swal('Message Center','Fetching a previously started conversation');
				// 		$scope.currentTab = i+1
				// 		console.log('current tab', $scope.unreadOpenMessages.indexOf($scope.unreadOpenMessages[i]));
				// 		getMessagesBetween();
				// 		return;
				// 	}
				// }
				// // if previous convo not found, adds a temporary message open area for new message
				// $scope.unreadOpenMessages.push($scope.sendTo);
				// $scope.currentTab = $scope.unreadOpenMessages.length-1;
			}
	});

	// fetches new info every 2 seconds
	// setInterval(updateMessageCenter, 2000);
	// removing polling for time being
	updateMessageCenter();
}]);
