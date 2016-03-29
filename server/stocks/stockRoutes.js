var stockController = require('./stockController.js');
var Auth = require('./../config/auth.js');

module.exports = function(app){

	app.get('/:stockName', stockController.getStock);

  app.get('/searchbar/:stockName', stockController.searchBar);

}