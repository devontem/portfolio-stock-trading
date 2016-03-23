var League = require('../../db/models').League;
var config = require('../config/middleware.js');
var http = require('http-request');
var Portfolio = require('../../db/models').Portfolio;
var Transaction = require('../../db/models').Transaction;
var User = require('../../db/models').User;
var orm = require('../../db/models').orm;
var schedule = require('node-schedule');
var moment = require('moment');

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
        numOfTrades: 0
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
  console.log('The answer to life, the universe, and everything!************************************************************************************************************************************************************************************************************************************************************************************************************************');
});

var closeLeague = function () {
  var currentMoment = moment().utc();
  // TODO: Change this to false later
  League.findAll({where: {hasEnded: false}})
  .then(function (finishedLeagues) {
    var leaguesEnded = [];
    // console.log(finishedLeagues);
    for (var i = 0; i < finishedLeagues.length; i++) {
      leaguesEnded.push(finishedLeagues[i].dataValues.id);
    }
    for (var j = 0; j < leaguesEnded.length; j++) {
      Portfolio.findAll({where: {leagueId: leaguesEnded[j]}})
      .then(function (portfolios) {
        var portsToSort = [];
        portfolios.forEach(function (portfolio) {
          var portObj = {};
          portObj.id = portfolio.dataValues.id;
          portObj.balance = portfolio.dataValues.balance;
          portObj.portfolioValue = portfolio.dataValues.portfolioValue;
          portObj.UserId = portfolio.dataValuesUserId;
          portObj.LeagueId = portfolio.dataValues.LeagueId;
          portsToSort.push(portObj);
        });
        
      });
    }
    });
};

closeLeague();

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
