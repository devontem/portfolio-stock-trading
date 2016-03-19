var userController = require('./userController.js');
var passport = require('passport');

module.exports = function(app){

	app.get('/', userController.getUsers);

	app.post('/', userController.newUser);

  app.post('/signin', userController.signIn);

	app.get('/users/:id', userController.getUserById);

  app.post('/getuser', userController.getSingleUser);

	app.put('/:id', userController.updateUser);

  app.post('/profileimage', userController.profileImage);

	app.delete('/', userController.deleteUser);
}