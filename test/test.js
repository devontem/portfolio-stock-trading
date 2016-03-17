var expect = require('chai').expect;
var supertest = require("supertest");
var should = require("should");
var server = require("../server/server.js")

// This agent refers to PORT where program is runninng.

var request = supertest.agent(server);

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
      // just assume that if it contains an <input> tag its index.html
      request
        .get('/api/users')
        .set('Accept', 'text/plain')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200, done)
    });
  });

  describe("GET /api/leagues", function () {
    it("should return that a token is not provided", function (done) {
      // just assume that if it contains an <input> tag its index.html
      request
        .get('/api/leagues')
        .expect('Token not provided')
        .expect(403, done)
    });
  });

});