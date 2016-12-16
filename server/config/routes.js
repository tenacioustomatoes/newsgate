const expanderController = require('../controllers/expanderController.js');
const newsController = require('../controllers/newsController.js');
const watsonController = require('../watson/watsonController.js');
const biasController = require('../bias/biasController.js');
const linkController = require('../controllers/linkController.js');
const watsonTestController = require ('../watson/testDataController.js');
const googleTrends = require('../trends/googleTrends');
const twitterSearch = require('../trends/twitterTrends');
const memoizedData = require('../controllers/memoizedDataController.js');

var Popover = memoizedData.popover;

module.exports = function (app, express) {

/*  This middlware builds the response object starting with the URL expansion
  and tacking on the successive API calls by calling the controllers' next()
  function.
  You'll likely want to improve upon this by creating different endpoints with
  different middleware pipes e.g. a pipe to just poll the blacklist, or a pipe
  just for talking to Watson and so forth.
*/


/// facebook auth
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      console.log('autenticated!') 
      console.log(req.user);
      return next(); 
    } else {
      console.log('not authenticated')
      res.send('false')
    }
  }
///


  // -----------------
  // Main API route
  // -----------------

  var apiArr = [watsonController.getTitle, newsController.isFakeNews, watsonController.getKeywords, twitterSearch.getTweetsOnTopic, googleTrends.getGoogleTrends];

  app.post('/api', apiArr, function(req, res, next) {
    res.json(res.compoundContent);
  });

  // -----------------
  // Popover route
  // -----------------

  var popupArr = [watsonController.getTitle, memoizedData.readPopoverData, newsController.isFakeNews, watsonController.getEmotions, watsonController.getSentiment, biasController.getData, memoizedData.recordPopoverData];

  app.post('/api/popover', popupArr, function(req, res, next, Popover) {
    res.json(res.compoundContent);
  });

  // Dummy data for testing popover
  app.post('/api/popover/test', watsonTestController.data);

  // -----------------
  // Links route
  // -----------------

  var linkArr = [ensureAuthenticated, watsonController.getTitle, watsonController.getKeywords, linkController.saveToDB];

  app.post('/api/links', linkArr, function (req, res, next) {
    res.json(res.compoundContent);
  });

  // -----------------
  // Single controller routes
  // -----------------

  app.post('/api/test', watsonController.getTitle);
  app.get('/api/googleTrends', googleTrends.getGoogleTrends);
  app.get('/api/bias', biasController.getData);
  app.get('/api/twitter', twitterSearch.getTweetsOnTopic);


};
