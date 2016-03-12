var Transaction = require('../../db/models').Transaction;
var Portfolio = require('../../db/models').Portfolio;

//make a transaction
module.exports.buySell = function(req, res){
  Transaction.create(req.body).then(function(transaction){
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
      res.status(404);
      res.end();
    } 
  })
  .catch(function(err) {
    console.error('Error getting users:', err);
    res.end();
  });
}

//Get all transactions
module.exports.getAllTransactions = function(req,res){
  Transaction.findAll({}).then(function(transactions){
    if(transactions){
      res.json(transactions);
    }else{
      console.log('No user found!');
      res.status(404);
      res.end();
    }
  })
  .catch(function(err) {
    console.error('Error getting users:', err);
    res.end();
  });
}


