var Badge_user = require('../../db/models').Badge_user;
var Badge = require('../../db/models').Badge;
var User = require('../../db/models').User;
var config = require('../config/middleware.js');
var request = require('request');

module.exports.getBadges = function(req, res){
  var id = req.body.userId;
  Badge_user.findAll({where:{UserId: id}}).then(function(badges){
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
  User.findById(id).then(function (user) {
    user.addBadge(badge);
  }).then(function(badges){
    res.json(badges);
  }).catch(function(err){
      res.send("Error posting the badge: ", err);
  });

};

module.exports.postBadgeServer = function(id, badge){
  User.findById(id).then(function (user) {
    user.addBadge(badge);
  })
  .catch(function(err){
      console.log("Error posting the badge: ", err);
      return;
  });
};

//fethes badges the user has not earned yet
module.exports.possibleBadges = function (req, res) {
  var id = req.body.userId;
  Badge_user.findAll({where:{UserId: id}}).then(function(badges){
    if(badges){
      var badgeList = [];
      for (var i = 0; i < badges.length; i++) {
        badgeList.push(badges[i].dataValues.BadgeId);
      }
      Badge.findAll({where: {id: {$not:  badgeList, $gt: 1}}}).then(function(badgeDescription){
        res.send(badgeDescription);
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
    text: 'Badge which seeds the database. Is not a real bad. Used as a flag to test seeding',
    id: 1
  });
  Badge.create({
    name: 'Welcome',
    text: 'The first million starts with the first dollar. You earned this badge for signing up with Portfol.io',
    icon: 'flaticon-commerce',
    id: 2
  });
  Badge.create({
    name: "The Winner's Circle",
    text: 'Congrats! You won your first league. Now for hundred more!',
    icon: 'flaticon-ribbon',
    id: 3
  });
  Badge.create({
    name: "Second Place",
    text: 'Congrats! You earned second place!',
    icon: 'flaticon-two-1',
    id: 4
  });
  Badge.create({
    name: "Third Place",
    text: 'Congrats! You earned Third place!',
    icon: 'flaticon-three',
    id: 5
  });
  Badge.create({
    name: 'Private League',
    text: 'You joined your first private league!',
    icon: 'flaticon-tool',
    id: 6
  });
  Badge.create({
    name: '5% Average Return!',
    text: 'Great work! You are in the bigtime now!',
    icon: 'flaticon-business',
    id: 7
  });
  Badge.create({
    name: '10% Average Return!',
    text: 'You joined your first public league! Enjoy',
    icon: 'flaticon-graphic',
    id: 8
  });
  Badge.create({
    name: '15% Average Return!',
    text: 'You joined your first public league! Enjoy',
    icon: 'flaticon-line',
    id: 9
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
