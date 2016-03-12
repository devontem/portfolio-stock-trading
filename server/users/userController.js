var User = require('../../db/models').User;
var jwt = require('jsonwebtoken');

module.exports.newUser = function (req, res){
  User.findOne({where:{ username: req.body.username }})
    .then(function (user) {
      if(!user){
        User.create({ 
          username: req.body.username, 
          password: req.body.password, 
          email: req.body.email 
        })
        .then(function(user){
              var myToken = jwt.sign( {user: user.id,
                                       username: user.username},
                                      'secret',
                                     { expiresIn: 24 * 60 * 60 });
              res.send(200, {'token': myToken,
                             'userId':    user.id } );
        })
      }else{
        res.status(404).json('Username already exist!');
      }
    })
    .catch(function (err) {
      res.send('Error creating user: ', err.message);
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

module.exports.updateUser = function (req, res) {
  User.findOne({ id: req.params.id })
    .then(function (user) {
      user.update(req.body).then(function(){
      	res.json('User updated');
      });
    })
    .catch(function (err) {
      res.send("Error updating user: ", err);
    });
};

module.exports.deleteUser= function (req, res) {
  User.findOne({ id: req.params.id })
    .then(function (user) {
      return user.destroy();
    }).then(function(){
    	res.json('User has been deleted')
    })
    .catch(function (err) {
      res.send(err);
    });
};

module.exports.signIn = function (req, res){
  User.findOne({where:{ username: req.body.email }})
    .then(function (user) {
      if(!user){
        res.json('User not found')
      }else{
        if(user.validPassword(req.body.password)){
          var myToken = jwt.sign({ user: user.id,
                                   username: user.username},
                                'secret',
                                { expiresIn: 24 * 60 * 60 });
          res.send(200, {'token': myToken,
                         'userId':    user.id} );
        }else{
          res.status(404).json('Authentication failed. Wrong password.')
        }
      }
    })
    .catch(function (err) {
      res.send('Error finding user: ', err.message);
    });
};

module.exports.signOut = function (req, res){

};