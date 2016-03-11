var LeagueController = require('./leagueController');

module.exports = function(app){


  app.post('/' , LeagueController.addLeagueToDB);
  
  app.get('/', LeagueController.getAllLeagues);

  app.get('/:id', LeagueController.getOneLeague);
}
