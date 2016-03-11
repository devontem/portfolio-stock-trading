var transactionController = require('./transactionController.js');

module.exports = function(app){
  
  app.post('/', transactionController.buySell);

  app.get('/byPortfolioID', transactionController.getTransactionsByPortfolioId);

  app.get('/getAll', transactionController.getAllTransactions);
  
}
