var Forum = require('../../db/models').Forum;

module.exports.addTopic = function (req, res){
  Forum.create({
    title: req.body.title,
    description: req.body.description,
    creatorName: req.body.username,
    creatorId: req.body.userId
  })
  .then(function (topic) {
    res.send({title: topic.title, creatorName: topic.creatorName, description: topic.description})
  })
  .catch(function (err) {
    console.error('Error creating new topic: ', err.message);
    res.end();
  })
};

module.exports.getOneTopic = function(req, res){
  console.log('WHAT IS IT????', req.body)
  Forum.findAll({where: {id: req.body.id}}).then(function (topic) {
    if(!topic) {
      res.send('No topics found.');
    } else {
      res.send(topic);
    }
  })
  .catch(function(err) {
    res.send('Error getting topic:', err);
  });
};

module.exports.getAllTopics = function(req, res){
  Forum.findAll().then(function (topics) {
    if(!topics) {
      res.send('No topics found.');
    } else {
      res.send(topics);
    }
  })
  .catch(function(err) {
    res.send('Error getting topics:', err);
  });
};