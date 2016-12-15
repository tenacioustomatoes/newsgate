var expect = require('chai').expect;
var request = require('request');

describe('Server Endpoints: ', function() {

  var hostname = 'http://127.0.0.1:8000';

  describe('/API', function() {

    var options = {
      'uri': hostname + '/api',
      'method': 'POST',
      'followAllRedirects': true
    };

    var nyTimesRes = {};
    var theOnionRes = {};


    describe('testing real news site', function() {

      before(function(done) {

        this.timeout(10000);

        var nyTimes = options;
        nyTimes.json = {'url': 'http://www.nytimes.com/2016/12/15/opinion/to-understand-trump-learn-russian.html?action=click&pgtype=Homepage&clickSource=story-heading&module=opinion-c-col-left-region&region=opinion-c-col-left-region&WT.nav=opinion-c-col-left-region'};

        request(nyTimes, function(err, res, body) {
          nyTimesRes = res;
          done();
        });
      });

      describe('testing fake news site', function() {

        before(function(done) {

          this.timeout(10000);

          var theOnion = options;
          theOnion.json = {'url': 'http://www.theonion.com/infographic/can-trump-follow-through-his-campaign-promises-54792'};

          request(theOnion, function(err, res, body) {
            theOnionRes = res;
            done();
          });
        });

        it('should only handle real urls, sending 404 for invalid URLs', function(done) {

          var fakeOptions = options;
          fakeOptions.json = {'url': 'not a real url'};

          request(fakeOptions, function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            done();
          });

        });

        it('expand urls, and treat them as it would treat direct links', function(done) {

          this.timeout(10000);

          var shortnedUrlOptions = options;
          shortnedUrlOptions.json = {'url': 'nyti.ms/2hSE2MQ'};

          var expandedURLOptions = options;
          expandedURLOptions.json = {'url': 'http://www.nytimes.com/2016/12/15/us/pew-study-obama-september-11.html?src=twr&smid=tw-nytimes&smtyp=cur'
          };

          request(shortnedUrlOptions, function(err1, res1, body1) {
            request(expandedURLOptions, function(err2, res2, body2) {
              //Set meta data equal, because this will very by request
              res1.body.twitter = res2.body.twitter;
              expect(res1.body).to.deep.equal(res2.body);
              done();
            });
          });

        });

        it('should detect fake news sites correctly', function(done) {

          expect(nyTimesRes.body).to.have.property('fake');
          expect(nyTimesRes.body.fake.rating.score).to.equal(0);
          expect(theOnionRes.body).to.have.property('fake');
          expect(theOnionRes.body.fake.rating.score).to.equal(100);

          done();

        });

        it('Watson should find the site\'s title', function(done) {




        //.title.status === ok
        //.title.url = domain
        //.title.tiltle exists

          done();
        });

        it('Watson should find the site\'s keywords', function(done) {

         // .keywords.status === okay
         // .keywords.keywords is an array
         // .keywords.keywords forEach
         //   keyword.text is string
         //   keyword.relavance is a number between 0 and 1

          done();
        });

        it('Twitter search should find tweets', function(done) {

          // .twitter.statuses is a array
          // .twitter.statuses has length > 0
          // each .twitter.statuses.txt is a string of length > 0

          done();
        });

        it('Google trends should return queries', function(done) {

            //.google is an array
            //.google length > 0
            //.google each entry in array
              // should have .query propery
              // query should be a string
              // query length should be > 0
          done();
        });
      });
    });
  });
});


