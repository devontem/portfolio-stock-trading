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
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
//var processTrade = require('../transactions/transactionController').buySell;


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

  app.use(morgan('dev'));
  // Configuring middleware
  app.use(bodyParser.urlencoded({ extend: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({ secret: '04pistons'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/../../client'));

  // http.get('http://ichart.finance.yahoo.com/table.csv?s=AAPL&a=01&b=01&c=2014&d=01&e=01&f=2015&g=d&ignore=.csv', function(err, res){
  //   console.log(res.buffer.toString(),' ######')
  // })

  setInterval(function(){
    Order.findAll({ where: { executed: false }})
      .then(function(orders){
        var list = ' ';
        for(var i=0; i<orders.length; i++){
          list+=orders[i].dataValues.symbol + '+';
        }
        http.get('http://finance.yahoo.com/d/quotes.csv?s=' + list + '&f=sa', function(err, res){
          var ask = res.buffer.toString().split('\n');
          for(var i=0; i<orders.length; i++){
            //if set price is greater than current price, process trade
            if(Number(ask[i][1].split(',')[1]) < orders[i].dataValues.price){
              Order.destroy({ where: {id: orders[i].id }})
              var trade = {
                 symbol: orders[i].dataValues.symbol,
                 company: orders[i].dataValues.company,
                 portfolioId: orders[i].dataValues.PortfolioId,
                 shares: orders[i].dataValues.shares,
                 price: orders[i].dataValues.price,
                 marketPrice: orders[i].dataValues.price,
                 buysell: orders[i].dataValues.buysell,
                 executed: true
              }
              placeTrade(trade);
              placeOrder(trade);
            }
          }
        })
      })
  }, 4000)

  function placeOrder (trade){
    trade.PortfolioId = trade.portfolioId;
    Order.create(trade);
  }

  function placeTrade (trade){
    Transaction.create(trade).then(function(transaction){

      Portfolio.findOne({ where: { id: trade.portfolioId }})
      .then(function(portfolio){

        if (!transaction.buysell) { transaction.shares = -1 * transaction.shares; }

        var amount = transaction.price*transaction.shares;

        //amount is either subtracted or added to portfolioValue depending on if sold or bought
        portfolio.portfolioValue += amount;
        portfolio.balance -= (amount+10);


        //Setting the transaction's PortfolioId
        transaction.PortfolioId = portfolio.id;

        //Incrementing number of trades
        portfolio.numOfTrades++;

        //Setting the initial return
        transaction.return = 0;

        // Saving both instances
        transaction.save();
        portfolio.save();

      })
      .catch(function(err){
        console.log("ERRORERROR")
      });

    })
    .catch(function(err){
        console.log("ERRORERROR")
    });
  }

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

}
