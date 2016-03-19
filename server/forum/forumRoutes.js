var ForumController = require('./forumController');
var Auth = require('./../config/auth.js');

module.exports = function(app){


  app.get('/', function(){console.log('IS THIS WORKING???')}, Auth.authorize, ForumController.addTopic);

  app.post('/topics', Auth.authorize, ForumController.getAllTopics);
}