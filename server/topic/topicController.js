var Topic = require('../../db/models').Topic;

module.exports.addReply = function (req, res){
  Topic.create({
    topicId: req.body.topicId,
    message: req.body.message,
    userName: req.body.userName,
    userId: req.body.userId
  })
  .then(function (reply) {
    res.send({topicId: reply.topicId, message: reply.message, userName: reply.userName, userId: reply.userId})
  })
  .catch(function (err) {
    console.error('Error creating new reply: ', err.message);
    res.end();
  })
};

module.exports.getAllReplies = function(req, res){

  Topic.findAll({ where: {topicId: req.params.id}})
  .then(function (replies) {
    if(!replies) {
      res.send('No replies found.');
    } else {
      res.send(replies);
    }
  })
  .catch(function(err) {
    res.send('Error getting replies:', err);
  });
};