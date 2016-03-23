var request = require('request');

module.exports.getStock = function(req, res){

	var stockName = req.params.stockName;
	var query = "http://finance.yahoo.com/d/quotes.csv?s=" + stockName + "&f=c1p2asn";

	request(query, function(err, stock){
    var stockinfo = stock.body.split(',');
    var stockask = {  Change: stockinfo[0],
                      PercentChange: stockinfo[1].split('\"')[1],
                      symbol: stockinfo[3].split('\"')[1],
                      Ask: stockinfo[2],
                      Name: stockinfo[4].split('\"')[1] };

		if (err) { throw err; }

		//sending the stock information
		res.send(stockask);
	});

}

module.exports.searchBar = function(req, res){

  var stockName = req.params.stockName;
  var query = "http://finance.yahoo.com/d/quotes.csv?s=" + stockName + "&f=sl1abp2v";

  request(query, function(err, stock){
    var stockinfo = stock.body.split(',');
    var stockask = {  LastTradePriceOnly: stockinfo[1],
                      ChangeinPercent: stockinfo[4].split('\"')[1],
                      Symbol: stockinfo[0].split('\"')[1],
                      Ask: stockinfo[2],
                      Bid: stockinfo[3],
                      Volume: stockinfo[5] };

    if (err) { throw err; }
    
    //sending the stock information
    res.send(stockask);
  });

}