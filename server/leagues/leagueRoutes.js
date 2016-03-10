var LeagueController = require('./leagueController');

module.exports = function(app){


  app.post('/addLeague' , LeagueController.addLeagueToDB)
  
  app.get('/')
}
