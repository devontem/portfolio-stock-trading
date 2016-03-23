var League = require('../../db/models').League;
var config = require('../config/middleware.js');
var http = require('http-request');
var Portfolio = require('../../db/models').Portfolio;
var Transaction = require('../../db/models').Transaction;
var User = require('../../db/models').User;
var orm = require('../../db/models').orm;
var schedule = require('node-schedule');
var moment = require('moment');
var request = require('request');

module.exports.addLeague = function (req, res){
  var creatorId = req.body.creatorId;
  var creatorName = req.body.creatorName;
  var randomCode = null;

  // assigns a random secret code for private rooms
  if (req.body.private) { randomCode = makeCode(); };

  League.create({
    ownerid: creatorId,
  	name: req.body.name,
  	maxNum: req.body.max,
    startbalance: req.body.balance,
    start:req.body.start,
    end: req.body.end,
    private: req.body.private,
    code: randomCode,
    hasEnded: false
  })
  .then(function (league) {
    Portfolio.create({
        leagueId: league.id,
        UserId: creatorId,
        balance: league.startbalance,
        username: creatorName,
        leaguename: league.name,
        portfolioValue: 0,
        numOfTrades: 0,
        // Initializes the value to zero, won't be calculated until the league actually ends
        rank: 0
      })
      .then( function(res) {
        console.log('successfully added');
      });

  	res.send({id: league.id, name: league.name, private: league.private, code: league.code, maxNum: league.num, startbalance: league.balance});
  })
  .catch(function (err) {
  	console.error('Error creating league: ', err.message);
  	res.end();
  });
};

module.exports.joinLeague = function (req, res){
  var temp = {};
  User.findOne({ where: {id : req.body.userId }})
    .then(function(user){
      temp.username = user.dataValues.username;
    });
  League.findOne({ where: {id : req.body.leagueId }})
    .then(function(league){
      temp.startbalance = league.dataValues.startbalance;
      temp.leaguename = league.dataValues.name;
      Portfolio.create({
        leagueId: req.body.leagueId,
        UserId: req.body.userId,
        balance: temp.startbalance,
        portfolioValue: 0,
        numOfTrades: 0,
        username: temp.username,
        leaguename: temp.leaguename
      })
      .then(function (league) {
        res.send(league);
      })
      .catch(function (err) {
        console.error('Error creating league: ', err.message);
        res.end();
      });
    });
};

module.exports.userLeagues = function(req, res){

  Portfolio.findAll({ where: { userId: req.body.userId }})
    .then(function(portfolio){
      if(!portfolio){
        res.send();
      }else{
        res.json(portfolio);
      }
    })
    .catch(function (err) {
      console.error('Error getting portfolio: ', err);
      return;
    });
};

module.exports.getAllLeagues = function (req, res) {

  League.findAll({})
  .then(function (leagues) {
  	if(!leagues) {
  		console.log('No leagues found.');
  		res.end();
  	} else {
  		res.json(leagues);
  	}
  })
  .catch(function (err) {
  	console.error('Error getting leagues: ', err);
    return;
  });
};

module.exports.getOneLeague = function (req, res) {
	League.findById(req.params.id)
	.then(function (league) {
		res.send(league);
	})
	.catch(function (err) {
		console.error('Error getting league: ', err);
    return;
	});
};

module.exports.editOneLeague = function (req, res) {
  League.findById(req.params.id)
  .then(function (league) {

    // if public league becomes private or if user wants new code, rehash it
    if (req.body.private && !league.private || req.body.rehash){
      league.code = makeCode();
    }

    // update every user's portfolio 'leaguename' if changed
    if (req.body.name !== league.name){
      orm.query("UPDATE `Portfolios` SET `leaguename`= '"+req.body.name+"' WHERE `leagueId`="+req.params.id+";").then(function(){
        console.log('Portfolio Names Updated');
        return;
      });
    }

    league.name = req.body.name || league.name;
    league.startbalance = req.body.startbalance || league.startbalance;
    league.private = req.body.private || league.private;
    league.maxNum = req.body.maxNum || league.maxNum;
    league.start = req.body.start || start;
    league.end = req.body.end || league.end;

    league.save();
    res.send(league);
  })
  .catch(function (err) {
    console.error('Error getting league: ', err);
    return;
  });
};

module.exports.getUsers = function(req, res){
  Portfolio.findAll({where: {leagueId: req.body.leagueId}})
    .then(function(portfolios){
    if(!portfolios) res.redirect("/#/dashboard");
      res.send(portfolios);
    })
    .catch(function (err) {
      console.error('Error getting portfolios: ', err);
      return;
    });
};

module.exports.getLeagueByOwnerId = function(req, res){
  var userId = req.params.userId;

  League.findAll({
    where: {
      ownerid: userId
    }
  }).then(function(leagues){
    res.send(leagues);
  })
  .catch(function (err) {
      console.error('Error getting leagues: ', err);
      return;
    });
};

module.exports.deleteLeagueById = function(req, res){
  var leagueId;
  var leagueName;

  League.findById(req.params.id)
  .then(function (league) {
    leagueId = league.id;
    leagueName = league.leaguename;

    // league.destroy();

      Portfolio.findAll({
        where: {
          leagueId: leagueId
        }
      }).then(function(portfolios){

        // Forming query statement to remove all transactions from the database
        var query = 'DELETE FROM `Transactions` WHERE `PortfolioId` = '+portfolios[0].id+" ";
        var orConditions = "";
        for(var i = 1; i < portfolios.length;i++){
          orConditions+='OR `PortfolioId` = '+portfolios[i].id;
        }
        finalQuery = query + orConditions +';';

        // deleting all transactions
        orm.query(finalQuery).then(function(transactions){
          console.log("Transactions from "+leagueName+" removed");

          //deleting all portfolios associated league
          orm.query('DELETE FROM `Portfolios` where `leagueId`= '+leagueId).then(function(transactions){
            console.log("Portfolio's from "+leagueName+" removed.");

            //deleting league
            orm.query('DELETE FROM `Leagues` WHERE `id`= '+leagueId).then(function(transactions){
              console.log("Portfolio's from "+leagueName+" removed.");
              res.send('League and all assocated data removed.');
            });
          });
        });
    });
  })
  .catch(function(err){
    console.log('deleteLeagueById function error: ', err);
  });
};

function makeCode(){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i=0; i < 8; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

//Sets up the node schedule to run at 1pm PST which is 4pm EST, when the NYSE closes
//The live server (heroku) appears to be on PST
var rule = new schedule.RecurrenceRule();
//This should pull Monday-Friday
rule.dayOfWeek = [0, new schedule.Range(1, 5)];
rule.hour = 13;
rule.minute = 0;


var j = schedule.scheduleJob(rule, function(){
  closeLeague();
});

// This function is mainly used in the closeLeague function to get the most up to date portfolio values before ending the league
var getLatestPortfolioVals = function (arrayOfLeagues) {
  Portfolio.findAll({
    leagueId: arrayOfLeagues
  })
  .then(function(portfolios){
    portfolios.forEach(function (port) {
      Transaction.findAll({ where: {
        PortfolioId: port.id
      }}).then(function(transactions){

      if (transactions.length < 1){
        return;
      }

      port.portfolioValue = 0;

      // creates a list of all user stocks in order to query
      var stockNames = [];
      transactions.forEach(function(stock){
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
        if (!stocks.body.query) {
          console.log('error with the api request');
        }

        if (stocks.body.query.count === 1){
          transactions[0].marketPrice = stocks.body.query.results.quote.Ask;
          transactions[0].return = ( (transactions[0].marketPrice - transactions[0].price ) / transactions[0].price) * 100;
          port.portfolioValue += parseFloat(transactions[0].marketPrice) * transactions[0].shares;

          transactions[0].save();

        } else {
          var updatedStocks = stocks.body.query.results.quote;
          for (var i = 0; i < updatedStocks.length; i++){
            for (var j = 0; j < transactions.length; j++){
              if (updatedStocks[i].symbol === transactions[j].symbol){
                transactions[j].marketPrice = updatedStocks[i].Ask;
                transactions[j].return = ( (updatedStocks[i].Ask - transactions[j].price) / transactions[j].price) * 100;
                port.portfolioValue += parseFloat(transactions[j].marketPrice) * transactions[j].shares;
                transactions[j].save();
                break;
              }
            }
          }
        }

        port.save();
      });
    });
    });
  });
};

var closeLeague = function () {
  var currentMoment = moment().utc();
  League.findAll({where: {hasEnded: false}})
  .then(function (finishedLeagues) {
    var leaguesEnded = [];
    for (var i = 0; i < finishedLeagues.length; i++) {
      // Checks if the league has ended
      if (currentMoment.isAfter(finishedLeagues[i].dataValues.end)) {
        leaguesEnded.push(finishedLeagues[i].dataValues.id);
        // Updates model to indicate it has ended
        League.update({
          hasEnded: true
        }, {
          where: {id: finishedLeagues[i].dataValues.id}
        });
      }
    }
    //This updates all stocks to latest values
    getLatestPortfolioVals(leaguesEnded);
    for (var j = 0; j < leaguesEnded.length; j++) {
      Portfolio.findAll({where: {leagueId: leaguesEnded[j]}})
      .then(function (portfolios) {

        var portsToSort = [];
        portfolios.forEach(function (portfolio) {
          var portObj = {};
          portObj.id = portfolio.dataValues.id;
          portObj.balance = portfolio.dataValues.balance;
          portObj.portfolioValue = portfolio.dataValues.portfolioValue;
          portObj.UserId = portfolio.dataValues.UserId;
          portObj.LeagueId = portfolio.dataValues.leagueId;
          portObj.total = portObj.balance + portObj.portfolioValue;
          portsToSort.push(portObj);
        });
        portsToSort.sort(function (port1, port2) {
          if (port1.total < port2.total) {
            return 1;
          } else if (port1.total > port2.total) {
            return -1;
          } else {
            return 0;
          }
        });
        var rankings = 1;
        for (var k = 0; k < portsToSort.length; k++) {
          Portfolio.update({
            rank: rankings
          }, {
            where: {
              id: portsToSort[k].id
            }
          });

          // Checks to make sure that the current score does not equal the next score, and if so, makes them both have the same rank
          if (portsToSort[k + 1] && portsToSort[k].total === portsToSort[k + 1].total) {
            continue;
          } else {
            rankings +=1;
          }
        }
      });
    }
    });
};




//   League.destroy({
//     where: {
//       subject: 'programming'
//     },
//     truncate: true /* this will ignore where and truncate the table instead */

//   });


      //   Transaction.findAll({
      //     where: {
      //       PortfolioId: portfolio.id
      //     }
      //   }).then(function(transactions){
      //     refTransactions = transactions;
      //     res.send(transactions);
      //   })
      // });


    // });
