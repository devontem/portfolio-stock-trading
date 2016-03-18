var portfolioController = require('./portfolioController.js');
var Auth = require('./../config/auth.js');

module.exports = function(app){
  
  // app.post('/', portfolioController.addPortfolioToDB);

  // app.put('/:id', portfolioController.updatePortfolio);

  // app.get('/', portfolioController.getAllPortfolio);

  // gets all the stocks in a users portfolio

  app.get('/stocks/:leagueId/:userId', Auth.authorize, portfolioController.getUserStocks);
  app.put('/stocks/:leagueId/:userId', Auth.authorize, portfolioController.updateUserStocks);
  
  // gets users portfolio basic info
  app.get('/:leagueId/:userId', Auth.authorize, portfolioController.getPortfolio);
}
