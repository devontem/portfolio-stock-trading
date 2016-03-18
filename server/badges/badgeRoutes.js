var badgeController = require('./badgeController.js');

module.exports = function(app){

	app.post('/getBadges/', badgeController.getBadges);

	app.post('/', badgeController.postBadge);

};
