var chai = require('chai');
var mongoose = require('mongoose');
var expect = chai.expect;
// var request = require('supertest');
var request = require('request');
var Promise = require('bluebird');
mongoose.Promise = Promise;
//var app = require('../server/server.js');

chai.use(require('chai-things'));

describe('NewsGate API', function () {
  //var server;
/*
  before(function (done) {
    if (mongoose.connection.db) {
      return done();
    }
    mongoose.connect(dbURI, done);
  });

  beforeEach(function (done) {
    server = app.listen(3000, function() {
      clearDB(function () {
        Pokemon.create(starterPokemon, done);
      });
    });
  });

  afterEach(function () {
    //server.close();
  });
*/
  describe('/api/popup', function () {
    it('should get some data after asking for some popup', function () {
      console.log('');
      message = {
        url: 'http://www.nytimes.com/2016/12/13/us/politics/russia-hack-election-dnc.html?hp&action=click&pgtype=Homepage&clickSource=story-heading&module=a-lede-package-region&region=top-news&WT.nav=top-news'
      }
      var options = {
        url: 'http://localhost:8000/api/popup',
        form: message
      };
      request.post(options, function (err, response) {
        if(err) {
          console.log('errrr')
        } else {
          console.log('we are here')
          console.log(response);
        }
      });
    });
  });
});