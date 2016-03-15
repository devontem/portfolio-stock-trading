var LeagueController = require('./leagueController');
var auth = require('./../config/auth.js')

module.exports = function(app){

  app.post('/' , LeagueController.addLeague);

  app.get('/', LeagueController.getAllLeagues);

  app.get('/:id', LeagueController.getOneLeague);
  app.post('/id', LeagueController.getOneLeague);
  app.post('/getusers', LeagueController.getUsers);

  app.post('/joinleague', LeagueController.joinLeague);

  // app.post('/joinleague', function(req,res){
  //                   console.log(req.body,'**********');
  //                   console.log(req.headers['x-access-token'],'$$$$$$$');
  //                   console.log(req.headers,'$$$$33333');
  //                 }, LeagueController.joinLeague);

  app.post('/userleague', LeagueController.userLeagues);

}
