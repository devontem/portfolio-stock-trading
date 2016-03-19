var ForumController = require('./forumController');
var Auth = require('./../config/auth.js');

module.exports = function(app){


  app.post('/', Auth.authorize, ForumController.addTopic);

  app.get('/', Auth.authorize, ForumController.getAllTopics);
}