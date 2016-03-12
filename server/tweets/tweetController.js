var Twit = require('twit');
var moment = require('moment')


 var T= new Twit({
    consumer_key: 'wQX96fSNXd5Oyo0mhw0AHto5u'
  , consumer_secret: 'shbjbyIGPVpopdw5FD3o1EtQNUwbAe5aVkkKg7pziLHPlnBH9x'
  , app_only_auth: true
});

var params={ q: '$F', count: 5 }
  var messages = [];
    
  

module.exports.getTweets = function (req, res){
  T.get('search/tweets', params, function(err,data,response){
    for(var i=0;i<data.statuses.length;i++){
        var status=data.statuses[i];
        var tweetDate = status.created_at
        var date = new Date(Date.parse(tweetDate.replace(/( \+)/, ' UTC$1')));
        var time = moment(date).fromNow();
        messages.push({text:status.text,
                  user: status.user.screen_name,
                  created_at: time})
    }
    console.log(messages,'here');
    res.json(messages)
  })
}