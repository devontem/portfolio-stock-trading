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
      // console.log('ttraans', transactions)

      // minimizes doubles, adds all shares from same company
      var updatedShares = reduceStocks(transactions);

      // returns only the bought shares
      var reducedStocks = _.filter(updatedShares, function(transaction){
        return transaction.buysell && transaction.shares > 0;
      });

      res.send(reducedStocks);
    })
    .catch(function(err){
      res.send("There was an error: ", err);
    })
    
  })
  .catch(function(err){
    res.send("There was an error: ", err);
  })

}

module.exports.updateUserStocks = function(req, res){

  Portfolio.findOne({ where: {
    UserId: req.params.userId,
    leagueId: req.params.leagueId
  }}).then(function(portfolio){

    Transaction.findAll({ where: {
      PortfolioId: portfolio.id
    }}).then(function(transactions){

      if (transactions.length < 1){ res.send({error:null}); return }

      portfolio.portfolioValue = 0;

      // creates a list of all user stocks in order to query
      var stockNames = [];
      transactions.forEach(function(stock){
        if(stockNames.indexOf(stock.symbol) < 0){
          stockNames.push(stock.symbol);
        }
      })
      stockNames = stockNames.join(',');

      var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20%3D%20%27"+ stockNames +"%27&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json";
      console.log('query string', query)

      // querying user stocks
      request(query, function(err, stocks){
        stocks.body = JSON.parse(stocks.body);
        // stocks.body.query = undefined;
        // console.log('result', !stocks.body.query)
        // Too many queries instantaneously cause API to fail, sends error emit to client
        if (!stocks.body.query){ res.send({error:true}); return 0; }

        if (stocks.body.query.count === 1){
          transactions[0].marketPrice = stocks.body.query.results.quote.Ask;
          transactions[0].return = ( (transactions[0].marketPrice - transactions[0].price ) / transactions[0].price) * 100;
          portfolio.portfolioValue += parseFloat(transactions[0].marketPrice) * transactions[0].shares;
          console.log('new price->', stocks.body.query.results.quote.Ask, 'oldPrice->', transactions[0].price)
          transactions[0].save();

        } else {
          var updatedStocks = stocks.body.query.results.quote;
          index = 0;
          // console.log(updatedStocks)
          for (var i = 0; i < updatedStocks.length; i++){
            for (var j = 0; j < transactions.length; j++){
              if (updatedStocks[i].symbol === transactions[j].symbol){
                transactions[j].marketPrice = updatedStocks[i].Ask;
                transactions[j].return = ( (updatedStocks[i].Ask - transactions[j].price) / transactions[j].price) * 100;
                // console.log('new price->', newStock, 'oldPrice->', transactions[index].price)
                portfolio.portfolioValue += parseFloat(transactions[j].marketPrice) * transactions[j].shares;
                transactions[j].save();
                break;
              }
            }
          }
        }

        portfolio.save();
        // console.log('TRANSACTIONS - >', transactions)
       res.send({error:false});
      });
    })
    .catch(function(err){
      res.send("There was an error: ", err);
    })
    
  })
  .catch(function(err){
    res.send("There was an error: ", err);
  })

}

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
}

function reduceStocks(stocks){
  // removing duplicates, adding the sum of all trades for same company
  var storage = {}
  var finalArray = [];

  stocks.forEach(function(stock){
    if (!storage[stock.symbol]){
      storage[stock.symbol] = [];
    } 
    storage[stock.symbol].push(stock);
  });

  // console.log('storage---->', storage)

  for (var key in storage){
    if (storage[key].length > 1){
      // console.log(storage[key].symbol);
      var totalShares = _.pluck(storage[key], 'shares').reduce(function(prev, curr, currIndex){
        return prev + curr;
      });
      var avgPrice = _.pluck(storage[key], 'price').reduce(function(prev, curr, currIndex){
        return prev + curr;
      });

      // assigning the total shares / avgPrive to the first object in the array since all other properties are identical
      storage[key][0].shares = totalShares;
      storage[key][0].price = avgPrice / storage[key].length;
      finalArray.push(storage[key][0]);
    } else {
      finalArray.push(storage[key][0]);
    }
  }
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




