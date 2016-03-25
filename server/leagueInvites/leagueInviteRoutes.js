var leagueInviteController = require('./leagueInviteController.js');
var Auth = require('./../config/auth.js');

module.exports = function(app){
	app.put('/invite/:inviteId', leagueInviteController.markRead);

	app.get('/:userId', leagueInviteController.getInvitesByUserId)

	app.post('/:senderId/:receiverId', leagueInviteController.sendInvite)
};
