var LeagueController = require('./leagueController');
var auth = require('./../config/auth.js')

module.exports = function(app){

  app.post('/' , LeagueController.addLeague);
  
  app.get('/', LeagueController.getAllLeagues);

  app.get('/:id', LeagueController.getOneLeague);

  app.post('/getusers', LeagueController.getUsers);

  app.post('/joinleague', LeagueController.joinLeague);

}
