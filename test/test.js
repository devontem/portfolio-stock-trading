var expect = require('chai').expect;
var supertest = require("supertest");
var should = require("should");
var server = require("../server/server.js")

// This agent refers to PORT where program is runninng.

var request = supertest.agent(server);

// Testing for GET requests to API and Index.htl

describe("server", function() {
  describe("GET /", function () {
    it("should return the content of index.html", function (done) {
      // just assume that if it contains an <input> tag its index.html
      request
        .get('/')
        .expect(200, /<input/, done);
    });
  });

  describe("GET /api/users", function () {
    it("should return the content of api/users", function (done) {
      request
        .get('/api/users')
        .set('Accept', 'text/plain')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done)
    });
  });

  describe("GET /api/leagues", function () {
    it("should return that a token is not provided", function (done) {
      request
        .get('/api/leagues')
        .expect('Token not provided')
        .expect(403, done)
    });
  });

  var userid;
  var token;

  describe("POST /api/users", function () {
    it("should create user", function (done) {
      request
        .post('/api/users/')
        .send({username: 'john', email: 'john', password: 'john'})
        .expect(200, done)
    });
  });

  describe("POST /api/users/signin", function () {
    it("should sign in user", function (done) {
      request
        .post('/api/users/signin')
        .send({ email: 'john', password: 'john'})
        .expect(200)
        .end(function(err, res){
          if((err)) return done(err);
          userid = res.body.userId;
          token = res.body.token;
          done();
        })
    });
  });

  describe("POST", function(){
    it("should create a new leageue", function(done){
      request
        .post('/api/leagues')
        .send({
            token: token,
            creatorId: 1936,
            name: 'Mocha Testing',
            max: 100,
            balance: 200,
            start: null,
            end: null
        })
        .expect(200, done);
    })
  })

  describe("POST /api/users/delete", function () {
    it("should delete user", function (done) {
      request
        .delete('/api/users')
        .send({id: userid})
        .expect(200, done)
    });
  });


});


