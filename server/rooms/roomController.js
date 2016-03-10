
var League = require('../../db/models').Review;
var config = require('../config/config');
var http = require('http-request');

module.exports.addLeagueToDB = function (req, res){
  
  League.create({
  	name: req.body.name,
  	maxNum: req.body.num
  })
  .then(function (league) {
  	res.send({name: league.name, maxNum: league.num})
  })
  .catch(function (err) {
  	console.error('Error creating league: ', err.message);
  	res.end();
  })

}


module.exports.getAllLeagues = function (req, res) {
  
  League.findAll({})
  .then(function (leagues) {
  	if(!leagues) {
  		console.log('No leagues found.');
  		res.end();
  	} else {
  		res.send(leauges: leagues)
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
