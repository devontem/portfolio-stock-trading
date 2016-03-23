var analysisController = require('./analysisController.js');

module.exports = function(app){

  app.post('/', analysisController.stockdata);

};