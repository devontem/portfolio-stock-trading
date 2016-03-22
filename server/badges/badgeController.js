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
      Badge.findAll({where: {id: badgeList}}).then(function(badgeDescription){
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
    user.addBadge(badge);
  }).then(function(badges){
    res.json(badges);
  }).catch(function(err){
      res.send("Error posting the badge: ", err);
  });

};

//fethes badges the user has not earned yet
module.exports.possibleBadges = function (req, res) {
  var id = req.body.userId;
  Badge_user.findAll({UserId: id}).then(function(badges){
    if(badges){
      var badgeList = [];
      for (var i = 0; i < badges.length; i++) {
        badgeList.push(badges[i].dataValues.BadgeId);
      }
      Badge.findAll({where: {id: {$not:  badgeList, $gt: 1}}}).then(function(badgeDescription){
        res.json(badgeDescription);
        console.log(res);
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

var badgeMaker = function(){

  Badge.create({
    name: 'Seeded',
    text: 'Badge which seeds the database. Is not a real bad. Used as a flag to test seeding'
  });
  Badge.create({
    name: 'Welcome',
    text: 'The first million starts with the first dollar. You earned this badge for signing up with Portfol.io',
    icon: 'fiber_new'
  });
  Badge.create({
    name: "The Winner's Circle",
    text: 'Congrats! You won your first league. Now for hundred more!',
    icon: 'exposure_plus_1'
  });
  Badge.create({
    name: '3X',
    text: 'You Logged in for Three Consecutive Days. Woot!',
    icon: 'repeat'
  });
  Badge.create({
    name: '5X',
    text: 'You Logged in for Five Consecutive Days. Woot!',
    icon: 'replay_5'
  });
  Badge.create({
    name: 'Week 1',
    text: 'You Logged in every day for one week. Keep up the great work bigshot!',
    icon: 'fiber_new'
  });
  Badge.create({
    name: 'Shhh!',
    text: 'You joined your first private league!',
    icon: 'vpn_key'
  });
  Badge.create({
    name: 'Beginner Broker!',
    text: 'You joined your first public league! Enjoy',
    icon: 'lock'
  });
  Badge.create({
    name: '100K',
    text: 'You earned your first $100,000!',
    icon: 'attach_money'
  });
  Badge.create({
    name: '1 Mil',
    text: 'You earned your first million!',
    icon: 'attach_money'
  });
  Badge.create({
    name: '5 Mil',
    text: 'Five Million Earned?!?!?! Time to start looking into retirement',
    icon: 'attach_money'
  });
};

//Tests if the badges have been seeded
//if not, adds badges
Badge.findById(1).then(function(badge){
  if (badge) {
    console.log('badges already seeded');
  } else if (badge === null) {
    badgeMaker();
  }
});
