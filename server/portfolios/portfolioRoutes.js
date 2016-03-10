var portfolioController = require('./portfolioController');

module.exports = function(app){
  
  app.post('/portfolio', portfolioController.addPortfolioToDB);

  app.get('/')
}
