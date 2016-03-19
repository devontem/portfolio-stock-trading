var Badge_user = require('../../db/models').Badge_user;
var Badge = require('../../db/models').Badge;
var User = require('../../db/models').User;
var config = require('../config/middleware.js');
var request = require('request');

module.exports.getBadges = function(req, res){
  var id = req.body.userId;
  Badge_user.findAll({UserId: id}).then(function(badges){
    if(badges){
      var badgeList = [];
      for (var i = 0; i < badges.length; i++) {
        badgeList.push(badges[i].dataValues.BadgeId);
      }
      console.log('*******', badgeList);
      Badge.findAll({where: {id: badgeList}}).then(function(badgeDescription){
        console.log(badgeDescription);
        res.json(badgeDescription);
      })
      .catch(function (err) {
        console.log('Error querying the badges databaes:', err);
        res.end();
      });
    }else{
      console.log('No badges currently found!');
      res.end();
    }
  })
  .catch(function(err){
    console.error('Error getting badges ', err);
    res.end();
  });

};

module.exports.postBadge = function(req, res){
  var id = req.body.userId;
  var badge = req.body.badge;
  User.findOne({id: id}).then(function (user) {
    console.log(badge);
    user.addBadge(badge);
  }).then(function(badges){
    res.send(badges);
  }).catch(function(err){
      res.send("Error posting the badge: ", err);
  });

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
