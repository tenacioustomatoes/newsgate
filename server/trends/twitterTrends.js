var Twitter = require('twitter');
var Promise = require('bluebird');
var keys = require('./twitterAPIKey');
var bodyParser = require('body-parser');

var twitter = new Twitter({
  'consumer_key': keys.consumer_key,
  'consumer_secret': keys.consumer_secret,
  'access_token_key': keys.access_token_key,
  'access_token_secret': keys.access_token_secret
});

twitter = Promise.promisifyAll(twitter);

exports.getTweetsOnTopic = function(req, res, next) {
  // var keywords = res.compoundContent.title.title.slice(0,20);
  // console.log('twitter search titel: ', typeof res.compoundContent.title.title);

  var _filterKeywords = function(keywords) {
    var outputKeywords = [];
    outputKeywords = keywords.slice(0, 2);
    outputKeywords = outputKeywords.map(keyword => {
      var newkeyword = {};
      newkeyword.relevance = keyword.relevance;
      newkeyword.text = keyword.text.toLowerCase();
      var solutations = /\b(m[rs]s*)\b\.*/gi;
      newkeyword.text = newkeyword.text.replace(solutations, ''); //get rid of mr. and mrs.
      newkeyword.text = newkeyword.text.trim();
      console.log(keyword, 'in map keyword');
      console.log(newkeyword, 'in map newkeyword');

      return newkeyword;
    });
    //outputKeywords = keywords.filter(keyword => keyword.relevance > 0.75)
    return outputKeywords;
  };

  console.log(_filterKeywords(res.compoundContent.keywords.keywords));
  var query = '';
  _filterKeywords(res.compoundContent.keywords.keywords).forEach(function(keyword) {
    query += keyword.text + ' ';
  });

  console.log('query', query);

  twitter.getAsync('search/tweets', {q: query, result_type: 'popular', count: 10})
  .then(function(data) {
    console.log(data);
    res.compoundContent['twitter'] = data;
    next();
    //res.send(data);
  })
  .catch(function(err) {
    console.error('Error with Twitter GET request', err);
  });
};
