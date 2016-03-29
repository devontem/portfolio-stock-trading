var request = require('request');
var http = require('http-request');
var Portfolio = require('../../db/models').Portfolio;
var Transaction = require('../../db/models').Transaction;
var Watchlist = require('../../db/models').Watchlist;





module.exports.query = function(req, res){
 
  var stocks = req.body.stocks;
  var result = [];

  var list = ' ';
        for(var i=0; i<stocks.length; i++){
          list+=stocks[i] + '+';
        }
        http.get('http://finance.yahoo.com/d/quotes.csv?s=' + list + '&f=sc1p2a', function(err, response){
          var ask = response.buffer.toString().split('\n');
          
          ask.forEach(function(stock){
            result.push(stock.split(','));
          })
          console.log(result,'resss')
          res.json(result);

  })

}


//find all stocks from user

module.exports.getPortfolioId = function (req, res) {

	var response = [];
    console.log(req.body.id,'********')
	Portfolio.findAll({ where: {
                      userId: req.body.id
                      
                    }})
    .then(function(portfolios){
    	
    	portfolios.forEach(function(portfolio){
    		console.log(portfolio.id,'port')
    		response.push(portfolio.id)
    	})

        console.log(response,'respppp')
        res.json(response);

    	})
      
}

module.exports.getStocks = function (req,res){
    var companies = {};
    var results = []
    console.log(req.body.ids, 'id')
	Transaction.findAll({ where: { PortfolioId: 
	 {
		$in : req.body.ids 
	  }
	}
        })
        .then(function(transactions){
          transactions.forEach(function (transaction){
            companies[transaction.symbol] = transaction.shares
          })
          for(var company in companies){
          	if(companies[company] > 0){
              results.push(company)
          	}
          }
          console.log(results,'resulttsss')
          res.json(results)
        })
      

}