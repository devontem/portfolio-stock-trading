var DirectMessage = require('../../db/models').DirectMessage;
var User = require('../../db/models').User;
var orm = require('../../db/models').orm;
// var Transaction = require('../../db/models').Transaction;

module.exports.getMessages = function(req, res){

	var userId = req.params.userId;
	var queryString = 'SELECT * FROM `DirectMessages` WHERE `senderId` = '+userId+' OR `recipientId` = '+userId+';';

	orm.query(queryString).then(function(messages){
		res.send(messages[0]);
	})

}

module.exports.sendMessage = function(req, res){

	var senderId = req.params.senderId;
	var recipientId = req.params.recipientId;

	User.findById(recipientId).then(function(recipient){

		DirectMessage.create({
			senderId: senderId,
			senderUsername: req.body.senderUsername,
			recipientId: recipientId,
			recipientUsername: recipient.username,
			message: req.body.message,
			read: false,
			closed: false
		}).then(function(){
			console.log('Direct Message Sent.');
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