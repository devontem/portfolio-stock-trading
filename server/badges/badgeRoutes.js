var badgeController = require('./badgeController.js');

module.exports = function(app){

	app.get('/', badgeController.getBadges);
};
