app

  .factory('DirectMessage', function($http){

  	// stores user to send message to across views
  	var sendTo;
  	var setSendTo = function(user){
  		sendTo = user;	
  	}

  	var getSendTo = function(){
  		return sendTo;
  	}

  	var getMessagesBetween = function(id, friendId){
	    return $http({
	      method: 'GET',
	      url: '/api/directmessages/'+id+'/'+friendId
	    })
	    .then(function (data) {
	    	// console.log('get messages between', data)
	      return data.data[0];
	    });
	  }

	  var sendMessage = function(sender, recipient, msg){
	    return $http({
	      method: 'POST',
	      url: '/api/directmessages/'+ sender +'/'+recipient,
	      data: msg
	    })
	    .then(function(data){
	    	return data;
	    });
	  }

	  var updateMessage = function(msgId, msg){
	    return $http({
	      method: 'PUT',
	      url: '/api/directmessages/'+msgId,
	      data: data
	    })
	    .then( function (data) {
	      // console.log(data)
	      return data;
	    });
	  }

	  var getOpenAndUnreadMessages = function(id){
	    return $http({
	      method: 'GET',
	      url: 'api/directmessages/unreadopen/'+id
	    })
	    .then(function (data) {
	      return data.data;
	    });
	  }

	  var markAllMessagesReadBetween = function(senderId, recipientId){
	    return $http({
	      method: 'PUT',
	      url: 'api/directmessages/markread/'+senderId+'/'+recipientId
	    })
	    .then(function (data) {
	      return data.data;
	    });
	  }

	  var markMessageReadById = function(postId){
	    return $http({
	      method: 'PUT',
	      url: 'api/directmessages/markread/'+postId
	    })
	    .then(function (data) {
	      return data.data;
	    });
	  }

  	return {
  		updateMessage: updateMessage,
  		sendMessage: sendMessage,
  		getMessagesBetween: getMessagesBetween,
  		getOpenAndUnreadMessages: getOpenAndUnreadMessages,
  		setSendTo: setSendTo,
  		getSendTo: getSendTo,
  		markAllMessagesReadBetween: markAllMessagesReadBetween,
  		markMessageReadById: markMessageReadById
  	}

  });