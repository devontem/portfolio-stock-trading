var userController = require('./userController.js');
var passport = require('passport');

module.exports = function(app){

	app.get('/users', userController.getUsers);

	app.post('/users', userController.newUser);

  app.post('/signin', userController.signIn);

	app.get('/users/:id', userController.getUserById);

	app.put('/users/:id', userController.updateUser);

	app.delete('/users/:id', userController.deleteUser);
}