var request = require('request');

module.exports.getStock = function(req, res){

	var stockName = req.params.stockName;
	var query = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20%3D%20%27"+ stockName +"%27&diagnostics=false&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&format=json";

	request(query, function(err, stock){
		if (err) { throw err; }

		//sending the stock information
		res.send(stock.body);
	});

}