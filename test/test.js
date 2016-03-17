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

  describe("archived websites", function () {
    describe("GET", function () {
      it("should return the content of a website from the archive", function (done) {
        var fixtureName = "www.google.com";
        var fixturePath = archive.paths.archivedSites + "/" + fixtureName;

        // Create or clear the file.
        var fd = fs.openSync(fixturePath, "w");
        fs.writeSync(fd, "google");
        fs.closeSync(fd);

        // Write data to the file.
        fs.writeFileSync(fixturePath, "google");

        request
          .get("/" + fixtureName)
          .expect(200, /google/, function (err) {
            fs.unlinkSync(fixturePath);
            done(err);
          });
      });

      it("Should 404 when asked for a nonexistent file", function(done) {
        request.get('/arglebargle').expect(404, done);
      });
    });

    describe("POST", function () {
      it("should append submitted sites to 'sites.txt'", function(done) {
        var url = "www.example.com";

        // Reset the test file and process request
        fs.closeSync(fs.openSync(archive.paths.list, "w"));

        request
          .post("/")
          .send({ url: url })
          .expect(302, function (err) {
            if (!err) {
              var fileContents = fs.readFileSync(archive.paths.list, 'utf8');
              expect(fileContents).to.equal(url + "\n");
            }

            done(err);
          });
      });
    });
  });
});

describe("archive helpers", function(){
  describe("#readListOfUrls", function () {
    it("should read urls from sites.txt", function (done){
      var urlArray = ["example1.com", "example2.com"];
      fs.writeFileSync(archive.paths.list, urlArray.join("\n"));

      archive.readListOfUrls(function(urls){
        expect(urls).to.deep.equal(urlArray);
        done();
      });
    });
  });

  describe("#isUrlInList", function () {
    it("should check if a url is in the list", function (done) {
      var urlArray = ["example1.com", "example2.com"];
      fs.writeFileSync(archive.paths.list, urlArray.join("\n"));

      var counter = 0;
      var total = 2;

      archive.isUrlInList("example1.com", function (is) {
        expect(is);
        if (++counter == total) { done() }
      });

      archive.isUrlInList("gibberish", function (is) {
        expect(!is);
        if (++counter == total) { done() }
      });
    });
  });

  describe("#addUrlToList", function () {
    it("should add a url to the list", function (done) {
      var urlArray = ["example1.com", "example2.com\n"];
      fs.writeFileSync(archive.paths.list, urlArray.join("\n"));

      archive.addUrlToList("someurl.com", function () {
        archive.isUrlInList("someurl.com", function (is) {
          expect(is);
          done();
        });
      });
    });
  });

  describe("#isUrlArchived", function () {
    it("should check if a url is archived", function (done) {
      fs.writeFileSync(archive.paths.archivedSites + "/www.example.com", "blah blah");

      var counter = 0;
      var total = 2;

      archive.isUrlArchived("www.example.com", function (exists) {
        expect(exists);
        if (++counter == total) { done() }
      });

      archive.isUrlArchived("www.notarchived.com", function (exists) {
        expect(!exists);
        if (++counter == total) { done() }
      });
    });
  });

  describe("#downloadUrls", function () {
    it("should download all pending urls in the list", function (done) {
      var urlArray = ["www.example.com", "www.google.com"];
      archive.downloadUrls(urlArray);

      // Ugly hack to wait for all downloads to finish.
      setTimeout(function () {
        expect(fs.readdirSync(archive.paths.archivedSites)).to.deep.equal(urlArray);
        done();
      }, 25);
    });
  });
});
