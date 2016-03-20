var Order = require('../../db/models').Order;
var Portfolio = require('../../db/models').Portfolio;
var Transaction = require('../../db/models').Transaction;
var http = require('http-request');

module.exports.limitOrder = function(){
  setInterval(function(){
    Order.findAll({ where: { executed: false }})
      .then(function(orders){
        var list = ' ';
        for(var i=0; i<orders.length; i++){
          list+=orders[i].dataValues.symbol + '+';
        }
        http.get('http://finance.yahoo.com/d/quotes.csv?s=' + list + '&f=sa', function(err, res){
          var ask = res.buffer.toString().split('\n');
          for(var i=0; i<orders.length; i++){
            //if set price is greater than current price, process trade
            if(1 < orders[i].dataValues.price){
              Order.destroy({ where: {id: orders[i].id }})
              var trade = {
                 symbol: orders[i].dataValues.symbol,
                 company: orders[i].dataValues.company,
                 portfolioId: orders[i].dataValues.PortfolioId,
                 shares: orders[i].dataValues.shares,
                 price: orders[i].dataValues.price,
                 marketPrice: orders[i].dataValues.price,
                 buysell: orders[i].dataValues.buysell,
                 executed: true
              }
              placeTrade(trade);
              placeOrder(trade);
            }
          }
        })
      })
  }, 4000)
}

function placeOrder (trade){
  trade.PortfolioId = trade.portfolioId;
  Order.create(trade);
}

function placeTrade (trade){
  Transaction.create(trade).then(function(transaction){

    Portfolio.findOne({ where: { id: trade.portfolioId }})
    .then(function(portfolio){

      if (!transaction.buysell) { transaction.shares = -1 * transaction.shares; }

      var amount = transaction.price*transaction.shares;

      //amount is either subtracted or added to portfolioValue depending on if sold or bought
      portfolio.portfolioValue += amount;
      portfolio.balance -= (amount+10);


      //Setting the transaction's PortfolioId
      transaction.PortfolioId = portfolio.id;

      //Incrementing number of trades
      portfolio.numOfTrades++;

      //Setting the initial return
      transaction.return = 0;

      // Saving both instances
      transaction.save();
      portfolio.save();

    })
    .catch(function(err){
      console.log("ERRORERROR")
    });

  })
  .catch(function(err){
      console.log("ERRORERROR")
  });
}