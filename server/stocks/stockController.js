var request = require('request');

module.exports.getStock = function(req, res){

	var stockName = req.body;
	var query = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22"+ stockName+"%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json"

	request(query, function(err, stock){
		if (err) { throw err; }

		//sending the stock information
		res.status(200).send(stock.query.results);
	})

}