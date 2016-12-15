var expect = require('chai').expect;
var request = require('request');

describe('Request Handling', function() {

  var hostname = '127.0.0.1:8000';

  decribe('/API pathway', function() {

    var options = {
      'uri': hotname + '/api',
      'method': 'POST',
    };

    it('should only handle real urls, sending 400 for invalid URLs', function(done) {

    });

    it('expand urls, and treat them as it would treat direct links', function(done) {

    });

    it('should detect fake news sites correctly', function(done) {

      //has .fake
      //score 100 for nytimes
      //scope 0 for the onion

    });

    it('Watson should find the site\'s title', function(done) {

    //.title.status === ok
    //.title.url = domain
    //.title.tiltle exists

    });

    it('Watson should find the site\'s keywords', function(done) {

     // .keywords.status === okay
     // .keywords.keywords is an array
     // .keywords.keywords forEach
     //   keyword.text is string
     //   keyword.relavance is a number between 0 and 1

    });

    it('Twitter search should find tweets', function(done) {

      // .twitter.statuses is a array
      // .twitter.statuses has length > 0
      // each .twitter.statuses.txt is a string of length > 0

    });

    it('Google trends should return queries', function(done) {

        //.google is an array
        //.google length > 0
        //.google each entry in array
          // should have .query propery
          // query should be a string
          // query length should be > 0

    });
  });
});