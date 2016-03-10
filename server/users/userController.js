var User = require('../../db/models').User;

module.exports.newUser = function (req, res){
  User.create({ 
    username: req.body.username, 
    password: req.body.password, 
    email: req.body.email 
  })
  .then(function (user) {
    res.send({username: user.username, email: user.email});
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
 
};

module.exports.signOut = function (req, res){

};