var LeagueInvite = require('../../db/models').LeagueInvite;
var orm = require('../../db/models').orm;

module.exports.getInvitesByUserId = function(req, res){

	var userId = req.params.userId;

	orm.query('SELECT * FROM `LeagueInvites` WHERE `receiverId` = '+userId+';').then(function(invites){
		res.send(invites);
	})

}

module.exports.sendInvite = function(req, res){

	var sender = req.params.senderId;
	var receiver = req.params.receiverId;

	// creates instances from an array
	LeagueInvite.bulkCreate(req.body).then(function(){
		res.end();
	})
}

module.exports.markRead = function(req, res){

	var inviteId = req.params.inviteId;

	LeagueInvite.findById(inviteId).then(function(invite){
		invite.update({
			read: 1
		}).then(function(){
			console.log('League updated to read.')
			res.end();
		})
	})
}