var Twit = require('twit');
var moment = require('moment')
var Portfolio = require('../../db/models').Portfolio;
var Transaction = require('../../db/models').Transaction;
var config = require('../config/middleware.js');
var Promise = require('bluebird');

 var T= new Twit({
    consumer_key: 'wQX96fSNXd5Oyo0mhw0AHto5u'
  , consumer_secret: 'shbjbyIGPVpopdw5FD3o1EtQNUwbAe5aVkkKg7pziLHPlnBH9x'
  , app_only_auth: true
});


  
    
  

module.exports.getTweets = function (req, res){
  // var tweets = [];


  // var userCurrentStocks = {};

  // var userId = req.params.userId;
  // var leagueId = req.params.leagueId;
  
  // Portfolio.findOne({ where: {
  //   UserId: userId,
  //   leagueId: leagueId
  // }}).then(function(portfolio){

  //   Transaction.findAll({ where: {
  //     PortfolioId: portfolio.id
  //   }}).then(function(transactions){
  //         transactions.forEach(function(transaction){
  //           var sym = transaction.symbol;
  //           var shareNum = transaction.shares;
  //           userCurrentStocks[sym] = shareNum;
  //         })
        
  //     var search = ''
  //       for(var key in userCurrentStocks){
  //         if(userCurrentStocks[key] > 0){
  //           search += ('$' + key + ' OR ');
  //         }
          
  //       }
  //       console.log(search, 'mofo');
  //       search = search.slice(0,-3);
  //       console.log(search, 'final')
  //   var params = { q: search, count: 10 }
    

    
  //   var tweets = [];
  //   if(search){
  //   T.get('search/tweets', params, function(err,data,response){
  //     console.log(data, 'data11')
  //     tweets = [];
  //     for(var i=0;i<data.statuses.length;i++){
  //       var status=data.statuses[i];
  //       var tweetDate = status.created_at
  //       var date = new Date(Date.parse(tweetDate.replace(/( \+)/, ' UTC$1')));
  //       var time = moment(date).fromNow();
  //       tweets.push({text:status.text,
  //                 user: status.user.screen_name,
  //                 created_at: time})
    
  //   }
  //   console.log(tweets,'tee')
  //   res.json(tweets)
          
  //   })
  // }
  //   else {
  //   var search = '$AAPL OR $GOOG OR $MSFT OR $XOM'
  //   var params = { q: search, count: 10 }
  //     T.get('search/tweets', params, function(err, data, response){
  //       tweets = [];
  //       for(var i=0;i<data.statuses.length;i++){
  //       var status=data.statuses[i];
  //       var tweetDate = status.created_at
  //       var date = new Date(Date.parse(tweetDate.replace(/( \+)/, ' UTC$1')));
  //       var time = moment(date).fromNow();
  //       tweets.push({text:status.text,
  //                 user: status.user.screen_name,
  //                 created_at: time})
  //       // console.log(tweets,'moof')
  //      }
  //      res.json(tweets)
  //     })
  //   }
    
  //   })
  
  //  })
  
  
}