var League = require('../../db/models').League;
var config = require('../config/middleware.js');
var http = require('http-request');
var Portfolio = require('../../db/models').Portfolio;
var User = require('../../db/models').User;

module.exports.addLeague = function (req, res){
  var creatorId = req.body.creatorId;
  var creatorName = req.body.creatorName;
  League.create({
    ownerid: creatorId,
  	name: req.body.name,
  	maxNum: req.body.max,
    startbalance: req.body.balance,
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
        console.log('successfully added')
      })
    
  	res.send({id: league.id, name: league.name, maxNum: league.num, startbalance: league.balance})
  })
  .catch(function (err) {
  	console.error('Error creating league: ', err.message);
  	res.end();
  })
}

module.exports.joinLeague = function (req, res){
  var temp = {};
  User.findOne({ where: {id : req.body.userId }})
    .then(function(user){
      temp.username = user.dataValues.username;
    })
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
        res.send(league)
      })
      .catch(function (err) {
        console.error('Error creating league: ', err.message);
        res.end();
      })
    })  
}

module.exports.userLeagues = function(req, res){

  Portfolio.findAll({ where: { userId: req.body.userId }})
    .then(function(portfolio){
      if(!portfolio){
        console.log('No portfolio found.')
        res.send();
      }else{
        res.json(portfolio);
      }
    })
    .catch(function (err) {
      console.error('Error getting portfolio: ', err)
    })
}

module.exports.getAllLeagues = function (req, res) {

  League.findAll({})
  .then(function (leagues) {
  	if(!leagues) {
  		console.log('No leagues found.');
  		res.end();
  	} else {
  		res.json(leagues)
  	}
  })
  .catch(function (err) {
  	console.error('Error getting leagues: ', err)
  })
}

module.exports.getOneLeague = function (req, res) {
	League.findById(req.params.id)
	.then(function (league) {
		res.send(league)
	})
	.catch(function (err) {
		console.error('Error getting league: ', err)
	})
}

module.exports.getUsers = function(req, res){
  Portfolio.findAll({where: {leagueId: req.body.leagueId}})
    .then(function(portfolios){

      res.send(portfolios);
    })
    .catch(function (err) {
      console.error('Error getting portfolios: ', err)
    })
}






