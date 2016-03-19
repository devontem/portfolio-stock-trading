var Badge_User = require('../../db/models').Badge_user;
var Badge = require('../../db/models').Badge;
var config = require('../config/middleware.js');
var request = require('request');

module.exports.getBadges = function(req, res){
  var id = req.body.userId;
//   Badge_user.findAll({ where: {leagueId === userId }}).then(function(badges){
//     if(badges){
//       res.json(badges);
//     }else{
//       console.log('No badges currently found!');
//       res.end();
//     }
//   })
//   .catch(function(err){
//     console.error('Error getting badges ', err);
//     res.end();
//   });
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

var badgeMaker = function(){
  Badge.create({
    name: 'Joined',
    text: 'Badge for signing up with Portfol.io'
  });
  Badge.create({
    name: 'Won First League',
    text: 'Congrats on Conquering Your First League'
  });
  Badge.create({
    name: 'Logged in Three Days in a Row',
    text: 'You Logged in for Three Consecutive Days. Woot!'
  });
};

badgeMaker();
