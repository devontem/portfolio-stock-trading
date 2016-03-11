var userController = require('./userController.js');
var passport = require('passport');

module.exports = function(app){

	app.get('/', userController.getUsers);

	app.post('/', userController.newUser);

<<<<<<< HEAD
	app.get('/:id', userController.getUserById);
=======
  app.post('/users/signin', userController.signIn);

	app.get('/users/:id', userController.getUserById);
>>>>>>> d4ee1974dd47da9b56eefd6e00385c9e85116a49

	app.put('/:id', userController.updateUser);

	app.delete('/:id', userController.deleteUser);
}