var tweetController = require('./tweetController.js');

module.exports = function(app){
  
  app.get('/', tweetController.getTweets)

}