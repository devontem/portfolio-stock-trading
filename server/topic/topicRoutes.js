var TopicController = require('./topicController');
var Auth = require('./../config/auth.js');

module.exports = function(app){


  app.post('/', Auth.authorize, TopicController.addReply);

  app.get('/:id', Auth.authorize, TopicController.getAllReplies);

  app.delete('/', Auth.authorize, TopicController.deleteOneReply);
}