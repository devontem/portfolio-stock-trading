var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var http = require('http-request');
var League = require('../../db/models').League;
var User = require('../../db/models').User;
var Order = require('../../db/models').Order;
var Portfolio = require('../../db/models').Portfolio;
var Transaction = require('../../db/models').Transaction;
var Room_user = require('../../db/models').Room_user;
var Message = require('../../db/models').Message;
var Forum = require('../../db/models').Forum;
var Topic = require('../../db/models').Topic;

var Badge = require('../../db/models').Badge;
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var limitOrder = require('./limitOrder').limitOrder;


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

  // http.get('http://ichart.finance.yahoo.com/table.csv?s=AAPL&a=01&b=01&c=2014&d=01&e=01&f=2015&g=d&ignore=.csv', function(err, res){
  //   console.log(res.buffer.toString(),' ######')
  // })

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

};
