var request = require('request');

module.exports.getSymbol = function(req, res){

  var company = req.params.company;
  var query = "http://d.yimg.com/aq/autoc?query=" + company + "&region=US&lang=en-US";

//

  request(query, function(err, result){
    if (err) {
      throw err;
    }
    
    res.send(result.body);
  })

}