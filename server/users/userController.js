var User = require('../../db/models').User;
var Portfolio = require('../../db/models').Portfolio;
var jwt = require('jsonwebtoken');
var domain = 'sandbox5e718182e3c24b69a06f7da83d141d9f.mailgun.org';
var api_key = 'key-983c9a49f87895b83eeb82f07388eef4';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

module.exports.newUser = function (req, res){
  User.findOne({where:{ username: req.body.username }})
    .then(function (user) {
      if(!user){
        User.create({
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          badgeJoined: true,
          firstPlaces: 0,
          secondPlaces: 0,
          thirdPlaces: 0
        })
        .then(function(user){
              var myToken = jwt.sign( {user: user.id},
                                      'secret',
                                     { expiresIn: 24 * 60 * 60 });
              res.send(200, {'token': myToken,
                             'userId':    user.id,
                             'username': user.username } );
        });
      }else{
        res.status(404).json('Username already exist!');
      }
    })
    .catch(function (err) {
      res.send('Error creating user: ', err);
    });
};

module.exports.getUsers = function(req, res){
  User.findAll().then(function (users) {
    if(!users) {
      res.send('No users found.');
    } else {
      res.send(users);
    }
  })
  .catch(function(err) {
    res.send('Error getting users:', err);
  });
};

module.exports.getUserById = function (req, res) {
  User.findOne({ id: req.params.id })
    .then(function (user) {
      res.send(user);
    })
    .catch(function (err) {
      res.send(err);
    });
};

module.exports.getSingleUser = function (req, res) {
  User.findOne({where: { id: req.body.id }})
    .then(function (user) {
      res.send(user);
    })
    .catch(function (err) {
      res.send(err);
    });
};

module.exports.forgotpw = function(req, res){
  User.findOne({where: {email: req.body.email }})
    .then(function(user){
      if(!user){
        res.json('User not found');
      }else{
        //generate random temp pw
        var temppw = ''
        for(var i=0; i<8; i++){
          var randnum = Math.floor(Math.random()*36);
          var string = 'abcdefghijklmnopqrstuvwxyz1234567890';
          temppw += string[randnum];
        }
        user.update({
          password: temppw
        })
        var data = {
          from: 'Excited User <me@samples.mailgun.org>',
          to: req.body.email,
          subject: 'Your password has been reset @ Portfol.io',
          text: 'Hello dear ' + user.username + '!\nYour temporary password has been set to the\
following:\n'+ temppw + '\n\nPlease go to Portfol.io and log in with your temporary password.\
 Remember to reset your password in your account page after! Thank you!'
        };
        mailgun.messages().send(data, function (error, body) {
          res.send('Email sent');
        });
      }
    })
    .catch(function (err) {
      res.send(err);
    });
}

module.exports.updateUser = function (req, res) {
  var iden = req.params.id;
  User.findOne({ where: { id: iden }})
    .then(function (user) {
      User.findOne({ where: { email: req.body.email }})
        .then(function(check){
          if(check){
            res.end("Email already taken");
          }else{
            if(user){
              if(!user.validPassword(req.body.oldpassword, user.password)){
                res.end("Wrong old password");
              }else{
                user.update({
                  id: iden,
                  password: req.body.password,
                  email: req.body.email
                })
                .then(function(user){
                  res.json('User updated');
                });
              }
            }
          }
        });
    })
    .catch(function (err) {
      res.send("Error updating user: ", err);
    });
};

module.exports.deleteUser= function (req, res) {
  User.findOne({where: { id: req.body.id }})
    .then(function (user) {
      Portfolio.destroy({where: {username: user.username}});
      return user.destroy();
    }).then(function(){
    	res.json('User has been deleted');
    })
    .catch(function (err) {
      res.send(err);
    });
};

module.exports.signIn = function (req, res){
  User.findOne({where:{ email: req.body.email }})
    .then(function (user) {
      if(!user){
        res.json('User not found');
      }else{
        if(user.validPassword(req.body.password, user.password)){
          var myToken = jwt.sign({ user: user.id},
                                'secret',
                                { expiresIn: 24 * 60 * 60 });
          res.status(200).send({'token': myToken,
                         'userId': user.id,
                         'username': user.username } );
        }else{
          res.status(404).json('Authentication failed. Wrong password.');
        }
      }
    })
    .catch(function (err) {
      res.send('Error finding user: ', err.message);
    });
};

module.exports.profileImage = function(req, res){
  User.findOne({where:{ id: req.body.userId }})
    .then(function(user){
      if(user){
        user.update({ image : req.body.image })
      }else{
        res.status(404).json('No user found!')
      }
    })
    .catch(function (err) {
      res.send('Error finding user: ', err.message);
    });
}

module.exports.signOut = function (req, res){

};
