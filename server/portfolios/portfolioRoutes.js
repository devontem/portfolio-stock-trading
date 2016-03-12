var portfolioController = require('./portfolioController.js');

module.exports = function(app){
  
  // app.post('/', portfolioController.addPortfolioToDB);

  // app.put('/:id', portfolioController.updatePortfolio);

  // app.get('/', portfolioController.getAllPortfolio);
  
  // gets a users portfolio based on leagueId and UserId
  app.get('/:leagueId/:userId', portfolioController.getPortfolio);
}
