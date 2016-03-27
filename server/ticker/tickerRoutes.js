var tickerController = require('./tickerController.js');

module.exports = function(app){

  app.post('/', tickerController.getPortfolioId);

  app.post('/stocks', tickerController.getStocks);

  app.post('/stockquote', tickerController.query);

  
}
