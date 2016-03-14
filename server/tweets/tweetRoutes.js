var tweetController = require('./tweetController.js');

module.exports = function(app){
  
  app.get('/:leagueId/:userId', tweetController.getTweets)

}