var Badge = require('../../db/models').Badge;
var config = require('../config/middleware.js');
var request = require('request');

module.exports.getBadges = function(req, res){

  Bagge.findAll({ where: {
    UserId: req.params.userId
  }}).then(function(badges){

      res.send(reducedStocks);
  })
  .catch(function(err){
    res.send("There was an error: ", err);
  });

};
