var leagueTransactionsController = require('./leagueTransactionsController.js');


module.exports = function(app){

  app.post('/', leagueTransactionsController.getLeagueTransactionsfromDB);

}