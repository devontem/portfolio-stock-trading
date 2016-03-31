var DirectMessage = require('../../db/models').DirectMessage;
var User = require('../../db/models').User;
var orm = require('../../db/models').orm;
_ = require('underscore');
// var Transaction = require('../../db/models').Transaction;

module.exports.getMessagesBetween = function(req, res){

	var userId = req.params.userId;
	var friendId = req.params.friendId;

	var queryString = 'SELECT * FROM `DirectMessages` WHERE (`UserId` = '+userId+' OR `recipientId` = '+userId+') ';
	queryString+='AND (`UserId` = '+friendId+' OR `recipientId` = '+friendId+');';

	orm.query(queryString).then(function(messages){
		res.send(messages);
	});

}

module.exports.sendMessage = function(req, res){

	var senderId = req.params.senderId;
	var recipientId = req.params.recipientId;

	User.findById(recipientId).then(function(recipient){

		console.log('sender username', req.body.senderUsername)

		DirectMessage.create({
			UserId: senderId,
			username: req.body.senderUsername,
			recipientId: recipientId,
			recipientUsername: recipient.username,
			message: req.body.message,
			read: false,
			closed: false
		}).then(function(data){
			res.send(data);
		})

	});
}

module.exports.updateMessage = function(req, res){

	var messageId = req.params.messageId;

	DirectMessage.findById(messageId).then(function(message){

		message.read = req.body.read || message.read;
		message.closed = req.body.closed || message.closed;

		message.save();

	});
}

module.exports.getOpenAndUnreadMessages = function(req, res){

	var messageId = req.params.userId;

	var userId = req.params.userId;
	var queryString = 'SELECT * FROM `DirectMessages` WHERE (`UserId` = '+userId+' OR `recipientId` = '+userId+') AND (`closed` = 0);';
	// LINE BELOW TO BE IMPLEMENTED IN FUTURE
	// var queryString = 'SELECT * FROM `DirectMessages` WHERE (`UserId` = '+userId+' OR `recipientId` = '+userId+') AND (`read` = 0 OR closed = 0);';

	orm.query(queryString).then(function(messages){

		// taking out duplicates messages to the same recipient to create an email 'thread'
		var storage = {};
		var filtered = [];

		messages[0].forEach(function(message){
			if (message.UserId != userId){
				if (!storage[message.UserId]){
					storage[message.UserId] = [];
				}
				storage[message.UserId] = message
			}

			if (message.recipientId != userId){
				if (!storage[message.recipientId]){
					storage[message.recipientId] = [];
				}
				storage[message.recipientId] = message;
			}
		});

		for (var key in storage){
			filtered.push(storage[key]);
		}
		// var filtered = _.filter(messages[0], function(message){
			
		// 	if (message.UserId != userId){
		// 		if (!storage[message.UserId]){
		// 			storage[message.UserId] = true;
		// 			return true
		// 		}
		// 	}

		// 	if (message.recipientId != userId){
		// 		if (!storage[message.recipientId]){
		// 			storage[message.recipientId] = true;
		// 			return true;
		// 		}
		// 	}
		// 	return false;
		// })

		res.send(filtered);
	});
}

module.exports.markAllMessagesReadBetween = function(req, res){

	var senderId = req.params.senderId;
	var recipientId = req.params.recipientId;

	var queryString = 'UPDATE `DirectMessages` SET `read` = 1 WHERE (`UserId` = '+senderId+' OR `recipientId` = '+senderId+') ';
	queryString+='AND (`UserId` = '+recipientId+' OR `recipientId` = '+recipientId+');';

	orm.query(queryString).then(function(messages){
		res.send(messages);
	});

}

module.exports.markMessageReadById = function(req, res){

	var postId = req.params.postId;
	var recipientId = req.params.recipientId;

	var queryString = 'UPDATE `DirectMessages` SET `read` = 1 WHERE `id` = '+postId+';';

	orm.query(queryString).then(function(messages){
		res.send(messages);
	});

}











