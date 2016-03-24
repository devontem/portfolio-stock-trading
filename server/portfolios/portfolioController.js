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
      var originalPrice = transactions[0].price;
      var originalShares = transactions[0].shares;

      // minimizes doubles, adds all shares from same company
      var updatedShares = reduceStocks(transactions);

      // returns only the bought shares
      var reducedStocks = _.filter(updatedShares, function(transaction){
        return transaction.buysell && transaction.shares > 0;
      });

      res.send(reducedStocks);

      // transacations[0] was altered in reduceStocks, setting it back to original values
      transactions[0].update({
        shares: originalShares,
        price: originalPrice
      });
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
      var originalPrice = transactions[0].price;
      var originalShares = transactions[0].shares;

      // console.log('transactions', transactions.get())
      var trans = Array.prototype.slice.call(transactions)

      // minimizes doubles, adds all shares from same company
      var updatedShares = reduceStocks(transactions);

      console.log('updatedShares', updatedShares)

      // returns only the bought shares
      var reducedStocks = _.filter(updatedShares, function(transaction){
        return transaction.buysell && transaction.shares > 0;
      });

      console.log('reducedStocks', reducedStocks)

      // creates a list of all user stocks in order to query
      var stockNames = [];
      reducedStocks.forEach(function(stock){
        if(stockNames.indexOf(stock.symbol) < 0){
          stockNames.push(stock.symbol);
        }
      });

      // transacations[0] was altered in reduceStocks, setting it back to original values
      transactions[0].update({
        shares: originalShares,
        price: originalPrice
      });

      console.log('transactions2', transactions)
      console.log('trans', trans)
      stockNames = stockNames.join(',');
      console.log('stocknames', stockNames);

      var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20%3D%20%27"+ stockNames +"%27&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json";

      // querying user stocks
      request(query, function(err, stocks){
        stocks.body = JSON.parse(stocks.body);

        // Too many queries instantaneously cause API to fail, sends error emit to client
        if (!stocks.body.query){ res.send({error:true}); return 0; }

        // if only one stock is being updated
        if (stocks.body.query.count === 1){
          console.log('************** DOING ONLY ONE LOOP');
          var updatedStock = stocks.body.query.results.quote;
          for (var i = 0; i < transactions.length; i++){
            if (transactions[i].symbol === updatedStock.symbol){
              console.log('SYMBOLS MATCH '+transactions[i].symbol, 'was "'+transactions[i].price+'" and is now "'+updatedStock.Ask+'". Share # is '+transactions[i].shares)
              // transactions[i].marketPrice = updatedStock.Ask;

              // updating portfolio value with new market price * shares, for each transaction (incl negatives [aka sold shares])
              portfolioValue += (updatedStock.Ask * trans[i].shares);
              console.log('**********portfolioValue ->'+portfolioValue+' amount added ->'+updatedStock.Ask * transactions[i].shares)

              transactions[i].update({
                marketPrice: updatedStock.Ask
              });

              // transactions[i].save();
            }
          }
          // transactions[0].marketPrice = stocks.body.query.results.quote.Ask;
          // transactions[0].return = ( (transactions[0].marketPrice - transactions[0].price ) / transactions[0].price) * 100;
          // portfolio.portfolioValue += parseFloat(transactions[0].marketPrice) * transactions[0].shares;

          // transactions[0].save();

        } else {
          // console.log('*************DOING THE MULTIPLE LOOP', stocks.body.query.results.quote);
          // // when multiple stocks are being updated
          // var updatedStocks = stocks.body.query.results.quote;
          // for (var i = 0; i < updatedStocks.length; i++){
          //   console.log('**** first loop working!')
          //   for (var j = 0; j < transactions.length; j++){
          //     console.log('**** second loop working!')
          //     if (updatedStocks[i].symbol === transactions[j].symbol){
          //       console.log('SYMBOLS MATCH '+transactions[j].symbol, 'was "'+transactions[j].Ask+'" and is now"'+updatedStocks[i].Ask+'".')
          //       transactions[j].marketPrice = updatedStocks[i].Ask;
          //       // transactions[j].return = ( (updatedStocks[i].Ask - transactions[j].price) / transactions[j].price) * 100;
          //       // console.log('new price->', newStock, 'oldPrice->', transactions[index].price)
          //       portfolio.portfolioValue += parseFloat(transactions[j].marketPrice) * transactions[j].shares;
          //       transactions[j].save();
          //       // break;
          //     }
          //   }
          // }
        }

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

      // assigning the total shares / avgPrice to the first object in the array since all other properties are identical
      storage[key][0].shares = totalShares;
      storage[key][0].price = avgPrice / storage[key].length;
      finalArray.push(storage[key][0]);
    } else {
      var copy = _.extend({}, storage[key][0]);
      finalArray.push(storage[key][0]);
    }
  }
  console.log('final array', finalArray)
  return finalArray;
}

// module.exports.addPortfolioToDB = function (req,res) {
//   //var userid = req.body.userid;
//   var userid = 2
//   Portfolio.create({
//   	balance: 12000,
//   	UserId: userid
//   })
//   .then(function (portfolio){
//   	console.log(portfolio, 'port')
//   	res.send(portfolio)
//   })
//   .catch(function(err){
//   	console.error('Error creating portfolio: ', err.message);
//   	res.end();
//   })
// }

// //find portfolio id based on user id
// module.exports.updatePortfolio = function (req,res) {

//   var newBalance = req.body.balance;
//   var userid = req.body.userid;
//   var id = parseInt(req.params.id);

//   Portfolio.findById(id,{where: {UserId: userid}})
//   .then(function (portfolio) {
//   	  portfolio.balance = newBalance;
//   	  portfolio.save().then( function (){
//   	  	res.send(portfolio);
//   	  })
//   	  .catch(function (err) {
//   	    console.error('Error updating portfolio: ', err)
//       });
//   	})
// }
// //get all user's portfolios
// module.exports.getAllPortfolio = function (req, res){
// 	Portfolio.findAll({where: {UserId: 2}})
// 	.then(function (portfolios){
// 		if(portfolios){
// 		  res.send(portfolios);
// 		} else {
// 			console.log('No portfolios found');
//             res.end();
// 		}
// 	})
// 	.catch(function (err){
// 		console.error('Error getting portfolios: ', err);
// 		res.end();
// 	})
// }
