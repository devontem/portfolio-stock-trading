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
			console.log('Message Sent', msg);
			$scope.input = "";
			updateMessageCenter();
		});
	}

	 function getMessagesBetween(){
	 	// RecipientId's key is 'recipientId' if from left panel, 'id' if from profiles page
	 	$scope.recipientId = $scope.sendTo.recipientId == $scope.id ? $scope.sendTo.UserId : $scope.sendTo.recipientId;

	 	console.log('Sending from: ', $scope.id, 'to: ', $scope.recipientId)
		DirectMessage.getMessagesBetween($scope.id, $scope.recipientId).then(function(messages){
			$scope.messages = messages;

			// set all messages as read once retrieved
			// DirectMessage.markAllMessagesReadBetween($scope.id, $scope.recipientId).then(function(){
			// 	console.log('All messages now marked as read in database.')

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
				console.log('Most recent message marked read!');
			})
		}
		getMessagesBetween();
	}

	function updateMessageCenter(){
		getOpenAndUnreadMessages();
		if ($scope.sendTo){
			getMessagesBetween();
		}
	}

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
			// only update it ng-model if value changes
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
				console.log('was redirected, here: ', $scope.sendTo);
				console.log('list before iteration', $scope.unreadOpenMessages)

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
	setInterval(updateMessageCenter, 2000);
});