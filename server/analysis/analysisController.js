var fs = require('fs');
var http = require('http-request');

module.exports.stockdata = function(req, res){
  var start = req.body.start.split('-');
  var end = req.body.end.split('-');

  http.get('http://ichart.finance.yahoo.com/table.csv?s='+req.body.symbol+'&a='+start[1]+'&b='+start[2]+'&c='+start[0]+'&d='+end[1]+'&e='+end[2]+'&f='+end[0]+'&ignore=.csv', function(err, response){
    if(response){
      fs.writeFile('client/analysis/data.csv', response.buffer.toString(), 'utf8', function(err){
        if(err) return console.log("error")
      });
      res.send('data received');
    }else{
      res.send('Error retrieving data');
    }
  })

}


module.exports.getinfo = function(req, res){

  http.get('http://finance.yahoo.com/d/quotes.csv?s='+req.body.symbol+'&f=reb4jkj1m3m4l1st8&ignore=.csv', function(err, response){
    if(response){
      var info = response.buffer.toString().split(',');
      var stock = { pe: info[0],
                    earning: info[1],
                    bookvalue: info[2],
                    '52low': info[3],
                    '52high': info[4],
                    marketcap: info[5],
                    '50dayavg': info[6],
                    '200dayavg': info[7],
                    lastprice: info[8],
                    symbol: info[9],
                    pricetarget: info[10]
                      };
      res.send(stock);
    }else{
      res.send('Error retrieving data');
    }
  })
}
