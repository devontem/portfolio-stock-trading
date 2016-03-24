var Portfolio = require('../../db/models').Portfolio;
var Transaction = require('../../db/models').Transaction;
var config = require('../config/middleware.js');
var request = require('request');
var _ = require('underscore');

module.exports.getUserStocks = function(req, res){

  Portfolio.findOne({ where: {
    UserId: req.params.userId,
    leagueId: req.params.leagueId
  }}).then(function(portfolio){

    Transaction.findAll({ where: {
      PortfolioId: portfolio.id
    }}).then(function(transactions){

      // minimizes doubles, adds all shares from same company
      var updatedShares = reduceStocks(transactions);

      // returns only the bought shares
      var reducedStocks = _.filter(updatedShares, function(transaction){
        return transaction.buysell && transaction.shares > 0;
      });

      // console.log('updatedShares', updatedShares, 'reducedStocks', reducedStocks)

      res.send(reducedStocks);

    })
    .catch(function(err){
      res.send("There was an error: ", err);
    });

  })
  .catch(function(err){
    res.send("There was an error: ", err);
  });

};

module.exports.updateUserStocks = function(req, res){

  Portfolio.findOne({ where: {
    UserId: req.params.userId,
    leagueId: req.params.leagueId
  }}).then(function(portfolio){

    Transaction.findAll({ where: {
      PortfolioId: portfolio.id
    }}).then(function(transactions){

      if (transactions.length < 1){ res.send({error:null}); return }

      var portfolioValue = 0;

      // minimizes doubles, adds all shares from same company
      var updatedShares = reduceStocks(transactions);

      // returns only the bought shares
      var reducedStocks = _.filter(updatedShares, function(transaction){
        return transaction.buysell && transaction.shares > 0;
      });

      // creates a list of all user stocks in order to query
      var stockNames = [];
      reducedStocks.forEach(function(stock){
        if(stockNames.indexOf(stock.symbol) < 0){
          stockNames.push(stock.symbol);
        }
      });
      stockNames = stockNames.join(',');

      var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20%3D%20%27"+ stockNames +"%27&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json";

      // querying user stocks
      request(query, function(err, stocks){
        stocks.body = JSON.parse(stocks.body);

        // Too many queries instantaneously cause API to fail, sends error emit to client
        if (!stocks.body.query){ res.send({error:true}); return 0; }

        // if only one stock is being updated
        if (stocks.body.query.count === 1){
          var updatedStock = stocks.body.query.results.quote;
          for (var i = 0; i < transactions.length; i++){
            if (transactions[i].symbol === updatedStock.symbol){

              // Updating portfolioValue and marketprice for every transaction
              portfolioValue += (updatedStock.Ask * transactions[i].shares);
              transactions[i].update({
                marketPrice: updatedStock.Ask,
                return: ( (updatedStock.Ask - transactions[i].price ) / transactions[i].price) * 100
              });

            }
          }

        } else {
          // when multiple stocks are being updated
          var updatedStocks = stocks.body.query.results.quote;
          for (var i = 0; i < transactions.length; i++){
            for (var j = 0; j < updatedStocks.length; j++){
              if (transactions[i].symbol === updatedStocks[j].symbol){

                // Updating portfolioValue and marketprice for every transaction
                portfolioValue += (updatedStocks[j].Ask * transactions[i].shares);
                transactions[i].update({
                  marketPrice: updatedStocks[j].Ask,
                  return: ( (updatedStocks[j].Ask - transactions[i].price ) / transactions[i].price) * 100
                });

              }
            }
          }
        }

        // Saving final updated portfolio value
        portfolio.update({
          portfolioValue: portfolioValue
        })

       res.send({error:false});
      });
    })
    .catch(function(err){
      res.send("There was an error: ", err);
      return;
    });

  })
  .catch(function(err){
    res.send("There was an error: ", err);
  });

};

module.exports.getPortfolio = function(req, res){
  Portfolio.findOne({ where: {
    UserId: req.params.userId,
    leagueId: req.params.leagueId
  }}).then(function(portfolio){
    res.send(portfolio);
  })
  .catch(function(err){
    res.send("There was an error: ", err);
  });
};

function reduceStocks(stocks){
  // removing duplicates, adding the sum of all trades for same company
  var storage = {};
  var finalArray = [];

  stocks.forEach(function(stock){
    if (!storage[stock.symbol]){
      storage[stock.symbol] = [];
    }
    storage[stock.symbol].push(stock);
  });

  for (var key in storage){
    if (storage[key].length > 1){
      var totalShares = _.pluck(storage[key], 'shares').reduce(function(prev, curr, currIndex){
        return prev + curr;
      });
      var avgPrice = _.pluck(storage[key], 'price').reduce(function(prev, curr, currIndex){
        return prev + curr;
      });

      /// Sending a copy of the summary stock (with net values)
      var netStock = {
        company: storage[key][0].company,
        symbol: storage[key][0].symbol,
        marketPrice: storage[key][0].marketPrice,
        shares: totalShares,
        return: storage[key][0].return,
        buysell: storage[key][0].buysell,
        percentage: storage[key][0].percentage,
        price: avgPrice / storage[key].length
      }

      finalArray.push(netStock);
    } else {

      // Sending a copy of the summary stock (with net values)
      var netStock = {
        company: storage[key][0].company,
        symbol: storage[key][0].symbol,
        marketPrice: storage[key][0].marketPrice,
        shares: storage[key][0].shares,
        return: storage[key][0].return,
        buysell: storage[key][0].buysell,
        percentage: storage[key][0].percentage,
        price: storage[key][0].price
      }

      finalArray.push(netStock);
    }
  }

  return finalArray;
}
