var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var http = require('http-request');
var Rooms = require('../../db/models').Rooms;

module.exports = function (app, express) {

  // Creating routers
  var userRouter = express.Router();
  var roomRouter = express.Router();
  var portfolioRouter = express.Router();

  // Configuring middleware
  app.use(bodyParser.urlencoded({ extend: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({ secret: '04pistons'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/../../client'));

  // test for sample query
  http.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22AAPL%22)&env=store://datatables.org/alltableswithkeys&format=json', function(err, res){
    if(err){
      console.error(err);
      return
    }

    var res1 = res.buffer.toString();
    res1 = JSON.parse(res1).query.results.quote
    console.log(res1.symbol, res1.Ask, res1.Change_PercentChange);
  });
  

  //test
  Rooms.findOrCreate({where: {roomName: 'yo'}})
  

  // Connecting Router to route files
  app.use('/api/users', userRouter);
  app.use('/api/rooms', roomRouter);
  app.use('/api/portfolo', portfolioRouter);

  require('../users/userRoutes.js')(userRouter);
  require('../rooms/roomRoutes.js')(roomRouter);
  require('../portfolios/portfolioRoutes.js')(portfolioRouter);
 
  
  
    
  


}