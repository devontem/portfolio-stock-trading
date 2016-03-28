var LeagueController = require('./leagueController');
var Auth = require('./../config/auth.js');

module.exports = function(app){

  app.post('/' , LeagueController.addLeague);

  app.get('/', LeagueController.getAllLeagues);

  app.get('/:id', LeagueController.getOneLeague);

  app.put('/:id', LeagueController.editOneLeague);

  app.delete('/:id', LeagueController.deleteLeagueById);

  app.get('/owner/:userId', LeagueController.getLeagueByOwnerId);

  app.post('/getusers', LeagueController.getUsers);

  app.post('/joinleague', LeagueController.joinLeague);

  app.post('/userleague', LeagueController.userLeagues);

};
