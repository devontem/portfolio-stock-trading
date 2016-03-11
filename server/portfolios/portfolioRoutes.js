var portfolioController = require('./portfolioController');

module.exports = function(app){
  
  app.post('/', portfolioController.addPortfolioToDB);

  app.put('/:id', portfolioController.updatePortfolio);

  app.get('/', portfolioController.getAllPortfolio);
  
}
