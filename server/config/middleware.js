var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var http = require('http-request');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var limitOrder = require('./limitOrder').limitOrder;
var dayOrder = require('./limitOrder').dayOrder;
var publicLeagueAutoPilot = require('../leagues/leagueController').publicLeagueAutoPilot;

module.exports = function (app, express) {

  // Creating routers
  var userRouter = express.Router();
  var leagueRouter = express.Router();
  var portfolioRouter = express.Router();
  var stockRouter = express.Router();
  var tweetRouter = express.Router();
  var messageRouter = express.Router();
  var transactionRouter = express.Router();
  var symbolRouter = express.Router();
  var forumRouter = express.Router();
  var topicRouter = express.Router();
  var router = express.Router();
  var leagueTransactionsRouter = express.Router();
  var badgeRouter = express.Router();
  var directMessageRouter = express.Router();
  var WatchlistRouter = express.Router();
  var analysisRouter = express.Router();
  var leagueInviteRouter = express.Router();
  var tickerRouter = express.Router();

  app.use(morgan('dev'));
  // Configuring middleware
  app.use(bodyParser.urlencoded({ extend: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({ secret: '04pistons'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/../../client'));


  limitOrder();
  dayOrder();

  publicLeagueAutoPilot('Rookie League', 10, 25000, 48, 'daily');
  publicLeagueAutoPilot('Junior Broker League', 10, 75000, 48, 'daily');
  publicLeagueAutoPilot('Elite Broker League', 10, 250000, 48, 'daily');


  // Connecting Router to route files
  app.use('/api/users', userRouter);
  app.use('/api/leagues', leagueRouter);
  app.use('/api/portfolios', portfolioRouter);
  app.use('/api/stocks', stockRouter);
  app.use('/api/tweets', tweetRouter);
  app.use('/api/messages', messageRouter);
  app.use('/api/transactions', transactionRouter);
  app.use('/api/symbols', symbolRouter);
  app.use('/api/topics', topicRouter);
  app.use('/api/badges', badgeRouter);
  app.use('/api/forum', forumRouter);
  app.use('/api/recentTransactions', leagueTransactionsRouter);
  app.use('/api/directmessages', directMessageRouter);
  app.use('/api/analysis', analysisRouter);
  app.use('/api/watchlist', WatchlistRouter);
  app.use('/api/leagueinvites', leagueInviteRouter);
  app.use('/api/ticker', tickerRouter);

  require('../analysis/analysisRoutes.js')(analysisRouter);
  require('../tweets/tweetRoutes.js')(tweetRouter);
  require('../stocks/stockRoutes.js')(stockRouter);
  require('../symbol/symbolRoutes.js')(symbolRouter);
  require('../users/userRoutes.js')(userRouter);
  require('../leagues/leagueRoutes.js')(leagueRouter);
  require('../portfolios/portfolioRoutes.js')(portfolioRouter);
  require('../messageboard/messageRoutes.js')(messageRouter);
  require('../transactions/transactionRoutes.js')(transactionRouter);
  require('../forum/forumRoutes.js')(forumRouter);
  require('../topic/topicRoutes.js')(topicRouter);
  require('../leagueTransactions/leagueTransactionsRoutes.js')(leagueTransactionsRouter);
  require('../badges/badgeRoutes.js')(badgeRouter);
  require('../directMessages/directMessageRoutes.js')(directMessageRouter);
  require('../watchlist/watchlistRoutes.js')(WatchlistRouter);
  require('../leagueInvites/leagueInviteRoutes.js')(leagueInviteRouter);
  require('../ticker/tickerRoutes.js')(tickerRouter);

};
