var transactionController = require('./transactionController.js');

module.exports = function(app){
  
  app.post('/', transactionController.buySell);

  app.get('/byPortoflio', transactionController.getTransactionsByPortfolioId);

  app.get('/getAll', transactionController.getAllTransactions);
  
}
