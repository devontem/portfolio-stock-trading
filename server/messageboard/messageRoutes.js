var MessageController = require('./messageController');

module.exports = function(app){


  app.post('/', MessageController.addPostToDB);

  app.get('/', MessageController.getAllPosts);

}