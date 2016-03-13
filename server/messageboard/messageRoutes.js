var MessageController = require('./messageController');

module.exports = function(app){


  app.post('/', MessageController.addPostToDB);

  app.post('/leagues', MessageController.getAllPosts);

}