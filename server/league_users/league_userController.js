var League_User = require('../../db/models').League_User;
var League = require('../../db/models').League;
var User = require('../../db/models').User;

//get all users in certain league
module.exports.getAllUsers = function(req, res){
  var id = req.body.Id;
  League_user.findAll({ where: {leagueId === id }}).then(function(users){
    if(users){
      res.json(users);
    }else{ 
      console.log('No user found!');
      res.end();
    }
  })
  .catch(function(err){
    console.error('Error getting users ', err);
    res.end();
  })
}

//get all leagues for certain user
module.exports.getAllLeagues = function(req, res){
  var id = req.body.Id;
  League_user.findAll({ where: {userId === id }}).then(function(leagues){
    if(leagues){
      res.json(leagues);
    }else{
      console.log('No league found!');
      res.end();
    }
  })
  .catch(function(err){
    console.error('Error getting leagues ', err);
    res.end();
  })
}
