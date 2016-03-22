app

.controller('MessagesController', function($scope, $window, DirectMessage){
  $scope.username = $window.localStorage.getItem('com.tp.username');
  $scope.id = $window.localStorage.getItem('com.tp.userId');
  $scope.sendTo = null;



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
		console.log(msg, $scope.sendTo)

		DirectMessage.sendMessage($scope.id, recipientId, msg).then(function(){
			console.log('Message Sent', msg.message);
			$scope.input = "";
			updateMessageCenter();
		});
	}

	 function getMessagesBetween(){
	 	// RecipientId's key is 'recipientId' if from left panel, 'id' if from profiles page
	 	var recipientId = $scope.sendTo.recipientId == $scope.id ? $scope.sendTo.UserId : $scope.sendTo.recipientId;

	 	console.log('Sending from: ', $scope.id, 'to: ', recipientId)
		DirectMessage.getMessagesBetween($scope.id, recipientId).then(function(messages){
			$scope.messages = messages;

			// set all messages as read once retrieved
			DirectMessage.markAllMessagesReadBetween($scope.id, recipientId).then(function(){
				console.log('All messages now marked as read in database.')

				//refresh inbox
				getOpenAndUnreadMessages();
			})

			// Scrolls the chat to the bottom
			setTimeout(function(){
				$(".messages-content").scrollTop($(".messages-content")[0].scrollHeight);
			}, 20);
		});
	}

	function getOpenAndUnreadMessages(){
		DirectMessage.getOpenAndUnreadMessages($scope.id).then(function(data){
			$scope.unreadOpenMessages = data;
		});
	}

	$scope.selectSendTo = function(user, idx){
		$scope.sendTo = user;
		getMessagesBetween();
	}

	function updateMessageCenter(){
		getOpenAndUnreadMessages();
		if (!!$scope.sendTo){
			getMessagesBetween();
		}
	}

	// On page load fetches already open conversations
	DirectMessage.getOpenAndUnreadMessages($scope.id).then(function(data){
		console.log('data', data)
			$scope.unreadOpenMessages = data;

			//Setting who to send to if redirected from profile page
			var user = DirectMessage.getSendTo();
			if (user){
				$scope.sendTo = user;
				// if coming from profile page, fixes the key to match DirectMessages format
				$scope.sendTo.recipientId = user.id;
				$scope.sendTo.recipientUsername = user.username;
				console.log('was redirected, here: ', $scope.sendTo);

				// if a previous conversation has already been started between users, open it
				for (var i = 0; i < $scope.unreadOpenMessages.length; i++){
					if ($scope.unreadOpenMessages[i].recipientId === $scope.sendTo.recipientId){
						console.log('true')
						getMessagesBetween();
						return;
					}
				}
				// if previous convo not found, adds a temporary message open area for new message
				$scope.unreadOpenMessages.push($scope.sendTo);
			}
	});
});