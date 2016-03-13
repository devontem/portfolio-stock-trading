var portfolioController = require('./portfolioController.js');

module.exports = function(app){
  
  // app.post('/', portfolioController.addPortfolioToDB);

  // app.put('/:id', portfolioController.updatePortfolio);

  // app.get('/', portfolioController.getAllPortfolio);

  // gets all the stocks in a users portfolio
  app.get('/stocks/:leagueId/:userId', portfolioController.getUserStocks);
  
  // gets users portfolio basic info
  app.get('/:leagueId/:userId', portfolioController.getPortfolio);
}
