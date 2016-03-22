var directMessageController = require('./directMessageController.js');
var Auth = require('./../config/auth.js');

module.exports = function(app){

	app.put('/update/:messageId', directMessageController.updateMessage)

	app.get('/unreadopen/:userId', directMessageController.getOpenAndUnreadMessages);

	app.put('/markread/:senderId/:recipientId/', directMessageController.markAllMessagesReadBetween)
	
	app.get('/:userId/:friendId', directMessageController.getMessagesBetween)

	app.post('/:senderId/:recipientId', directMessageController.sendMessage)


}