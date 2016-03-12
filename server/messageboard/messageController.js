var Message = require('../../db/models').Message;

module.exports.addPostToDB = function (req, res){

  Message.create({
    userId: req.body.userId,
    name: req.body.name,
    message: req.body.message
  })
  .then(function (post) {
    console.log('======', post)
    res.send({name: post.name, message: post.message})
  })
  .catch(function (err) {
    console.error('Error creating message entry: ', err.message);
    res.end();
  })
};

module.exports.getAllPosts = function(req, res){
  console.log('inside get messages');
  Message.findAll().then(function (posts) {
    if(!posts) {
      res.send('No posts found.');
    } else {
      res.send(posts);
    }
  })
  .catch(function(err) {
    res.send('Error getting posts:', err);
  });
};