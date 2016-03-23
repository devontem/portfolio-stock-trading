var fs = require('fs');
var http = require('http-request');

module.exports.stockdata = function(req, res){
  var start = req.body.start.split('-');
  var end = req.body.end.split('-');

  http.get('http://ichart.finance.yahoo.com/table.csv?s='+req.body.symbol+'&a='+start[1]+'&b='+start[2]+'&c='+start[0]+'&d='+end[1]+'&e='+end[2]+'&f='+end[0]+'&ignore=.csv', function(err, response){
    if(response){
      fs.writeFile('../client/analysis/data.csv', response.buffer.toString(), 'utf8', function(err){
        if(err) return console.log("************")
      });
      console.log(response.buffer.toString(),' ######');
      res.send('data received');
    }else{
      res.send('Error retrieving data');
    }
  })

}
