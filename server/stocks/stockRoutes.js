var stockController = require('./stockController.js');

module.exports = function(app){

	app.get('/:stockName', stockController.getStock);

}