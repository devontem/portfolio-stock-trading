var LeagueController = require('./leagueController');
var Auth = require('./../config/auth.js');

module.exports = function(app){

  app.post('/' , Auth.authorize, LeagueController.addLeague);

  app.get('/', Auth.authorize, LeagueController.getAllLeagues);

  app.get('/:id', Auth.authorize, LeagueController.getOneLeague);

  app.post('/getusers', Auth.authorize, LeagueController.getUsers);

  app.post('/joinleague', Auth.authorize, LeagueController.joinLeague);

  app.post('/userleague', Auth.authorize, LeagueController.userLeagues);

}
