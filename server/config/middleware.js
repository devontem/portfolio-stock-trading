var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var http = require('http-request');
var League = require('../../db/models').League;
var User = require('../../db/models').User;
var Portfolio = require('../../db/models').Portfolio;
var Transaction = require('../../db/models').Transaction;
var Room_user = require('../../db/models').Room_user;
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

module.exports = function (app, express) {

  // Creating routers
  var userRouter = express.Router();
  var leagueRouter = express.Router();
  var portfolioRouter = express.Router();

  // Configuring middleware
  app.use(bodyParser.urlencoded({ extend: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({ secret: '04pistons'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/../../client'));
  // We are going to protect /api routes with JWT
  //app.use('/api', expressJwt({secret: 'secret'}));


  // test for sample query
  // http.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22AAPL%22)&env=store://datatables.org/alltableswithkeys&format=json', function(err, res){
  //   if(err){
  //     console.error(err);
  //     return
  //   }
  //   res = JSON.parse(res.buffer.toString()).query.results.quote
  //   console.log(res.symbol, res.Ask, res.Change_PercentChange);
  // });
  
  //TEST - create join table
  // User.create({name: "tdsafd", email:"fdsf3e4", password:"hi"})
  // User.create({name: "tdsaf", email:"fdsf3e", password:"hi"})

  // League.create({name: "lobby2", maxNum: 3}).then(function(){
  //   User.findOne({where: {email:"fdsf3e4"}})
  //     .then(function(user){
  //       League.findOne({where: {name: "lobby2"}})
  //         .then(function(league){
  //       user.addLeague(league, {symbol: "AAPL"});
  //       Portfolio.create({balance: 10000, UserId: 1}).then(function(){
  //         Transaction.create({symbol:'aapl', price: 50, buysell: true, shares: 300, PortfolioId:1})
  //       });
  //       Portfolio.create({balance: 10000, UserId: 2}).then(function(){
  //         Transaction.create({symbol:'aapl', price: 50, buysell: true, shares: 300, PortfolioId:2})
  //       });
  //     })
  //   })
  // })


  // Connecting Router to route files
  app.use('/api/users', userRouter);
  app.use('/api/leagues', leagueRouter);
  app.use('/api/portfolios', portfolioRouter);

  require('../users/userRoutes.js')(userRouter);
  require('../leagues/leagueRoutes.js')(leagueRouter);
  require('../portfolios/portfolioRoutes.js')(portfolioRouter);

}