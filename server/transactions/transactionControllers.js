var Transaction = require('../../db/models').Transaction;
var Portfolio = require('../../db/models').Portfolio;

//make a transaction
module.exports.buySell = function(req, res){
  Transacation.create({req.body}).then(function(transaction){
    console.log('Transaction posted', transaction);
    Portfolio.findById(transaction.PortfolioId, function(portfolio){
      var amount = transaction.price*transaction.shares
      if(transaction.buysell){
        portfolio.balance += amount;
      }else{
        portfolio.balance -= amount;
      }
    })
  })
}

//Get all transactions of Portfolio by passing in portfolioID
module.exports.getTransactionsByPortfolioId = function(req, res){
  var id = parseInt(req.body.id);

  Transaction.findAll({ where: { portfolioId === id }}).then(function(transactions){
    if(transactions){
      res.json(sessions);
    }else{
      console.log('No transaction found!');
      res.end();
    } 
  })
}

module.exports.getLastTransactions = function(req,res){
  Transaction.findById()
}