var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var http = require('http-request');

module.exports = function (app, express) {

  app.use(bodyParser.urlencoded({ extend: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({ secret: '04pistons'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/../../client'));

  http.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22AAPL%22)&env=store://datatables.org/alltableswithkeys&format=json', function(err, res){
    if(err){
      console.error(err);
      return
    }
    console.log(res.buffer.toString());
  })

}