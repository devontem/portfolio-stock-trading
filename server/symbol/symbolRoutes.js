var symbolController = require('./symbolController.js');

module.exports = function(app){

  app.get('/:company', symbolController.getSymbol);

}