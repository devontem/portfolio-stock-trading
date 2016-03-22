var request = require('request');
var http = require('http-request');
var Portfolio = require('../../db/models').Portfolio;
var Transaction = require('../../db/models').Transaction;
var Watchlist = require('../../db/models').Watchlist;

module.exports.getSymbol = function(req, res){

  var company = req.params.company;
  var query = "http://d.yimg.com/aq/autoc?query=" + company + "&region=US&lang=en-US";

//

  request(query, function(err, result){
    if (err) {
      throw err;
    }
    
    res.send(result.body);
  })

}


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
            if(Number(ask[i][1].split(',')[1]) < orders[i].dataValues.price){
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