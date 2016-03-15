var MessageController = require('./messageController');
var Auth = require('./../config/auth.js');

module.exports = function(app){


  app.post('/', Auth.authorize, MessageController.addPostToDB);

  app.post('/leagues', Auth.authorize, MessageController.getAllPosts);

}