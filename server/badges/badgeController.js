var Badge = require('../../db/models').Badge;
var config = require('../config/middleware.js');
var request = require('request');

module.exports.getBadges = function(req, res){

  // Badge.findAll({ where: {
  //   UserId: req.params.userId
  // }}).then(function(badges){
  //
  //     res.send(reducedStocks);
  // })
  // .catch(function(err){
  //   res.send("There was an error: ", err);
  // });
  console.log('(((((((((((())))))))))))', req.body.userId);
  res.send('badge route works');

};

module.exports.postBadge = function(req, res){

  // Badge.findAll({ where: {
  //   UserId: req.params.userId
  // }}).then(function(badges){
  //
  //     res.send(reducedStocks);
  // })
  // .catch(function(err){
  //   res.send("There was an error: ", err);
  // });
  console.log('****************', req.body.badge, req.body.userId);
  res.send('post badge route works');

};
