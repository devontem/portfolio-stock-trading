var transactionController = require('./transactionController.js');

module.exports = function(app){
  
  app.post('/', transactionController.buySell);

  app.post('/limitorder', transactionController.limitOrder);

  app.post('/getorders', transactionController.getOrders);

  app.post('/cancelorder', transactionController.cancelOrder);
  
  // app.get('/:leagueId/:userId', transactionController.getUserPortfolio);

  // app.get('/byPortfolioID', transactionController.getTransactionsByPortfolioId);

  // app.get('/getAll', transactionController.getAllTransactions);
  
}
