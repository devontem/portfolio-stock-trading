var Portfolio = require('../../db/models').Portfolio;
var config = require('../config/middleware.js');


  module.exports.getPortfolio = function(req, res){
    Portfolio.findOne({ where: {
      UserId: req.params.userId,
      leagueId: req.params.leagueId
    }}).then(function(portfolio){
      console.log('portfolio', portfolio)
      res.send(portfolio);
    })
    .catch(function(err){
      res.send("There was an error: ", err);
    })

  }

// module.exports.addPortfolioToDB = function (req,res) {
  
//   //var userid = req.body.userid;
//   var userid = 2
//   Portfolio.create({
//   	balance: 12000,
//   	UserId: userid
//   })
//   .then(function (portfolio){
//   	console.log(portfolio, 'port')
//   	res.send(portfolio)
//   })
//   .catch(function(err){
//   	console.error('Error creating portfolio: ', err.message);
//   	res.end();
//   })
// }

// //find portfolio id based on user id
// module.exports.updatePortfolio = function (req,res) {
  
//   var newBalance = req.body.balance;
//   var userid = req.body.userid;
//   var id = parseInt(req.params.id);

//   Portfolio.findById(id,{where: {UserId: userid}})
//   .then(function (portfolio) {
//   	  portfolio.balance = newBalance;
//   	  portfolio.save().then( function (){
//   	  	res.send(portfolio);
//   	  })
//   	  .catch(function (err) {
//   	    console.error('Error updating portfolio: ', err)
//       });
//   	})
// }
// //get all user's portfolios
// module.exports.getAllPortfolio = function (req, res){
// 	Portfolio.findAll({where: {UserId: 2}})
// 	.then(function (portfolios){
// 		if(portfolios){
// 		  res.send(portfolios);	
// 		} else {
// 			console.log('No portfolios found');
//             res.end();
// 		}
// 	})
// 	.catch(function (err){
// 		console.error('Error getting portfolios: ', err);
// 		res.end();
// 	})
// }




