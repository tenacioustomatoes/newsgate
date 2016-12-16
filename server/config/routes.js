var expanderController = require('../controllers/expanderController.js');
var newsController = require('../controllers/newsController.js');
var watsonController = require('../watson/watsonController.js');
var biasController = require('../bias/biasController.js');
var linkController = require('../controllers/linkController.js');
const googleTrends = require('../trends/googleTrends');
const twitterSearch = require('../trends/twitterTrends');
var passport = require('passport')

module.exports = function (app, express) {

/*  This middlware builds the response object starting with the URL expansion
  and tacking on the successive API calls by calling the controllers' next()
  function.
  You'll likely want to improve upon this by creating different endpoints with
  different middleware pipes e.g. a pipe to just poll the blacklist, or a pipe
  just for talking to Watson and so forth.
*/

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

  var apiArr = [expanderController.expandURL, newsController.isFakeNews, watsonController.getTitle, watsonController.getKeywords, twitterSearch.getTweetsOnTopic, googleTrends.getGoogleTrends, biasController.getData];

  app.post('/api', apiArr, function(req, res, next) {
    res.json(res.compoundContent);
  });

  var linkArr = [ensureAuthenticated, expanderController.expandURL, watsonController.getTitle, watsonController.getKeywords, linkController.saveToDB];

  app.post('/api/links', linkArr, function (req, res, next) {
    res.json(res.compoundContent);
  });

  app.post('/api/ext', newsController.isFakeNews, function(req, res, next) {
    res.json(res.compoundContent);
  });
  //

  app.post('/api/test', watsonController.getTitle);
  app.get('/api/googleTrends', googleTrends.getGoogleTrends);
  app.get('/api/twitter', twitterSearch.getTweetsOnTopic);
  app.get('/api/bias', biasController.getData);
  app.get('/login', passport.authenticate('facebook'));
  app.get('/login/return', passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      res.send('true');
    });
  // app.get('/login', function(req, res) {
  //   passport.authenticate('facebook');
  //   res.send('login endpoint works')
  // });
  app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){});
  app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/apitest.html' }),
  function(req, res) {
    console.log('im here')

    res.json('success');
    //res.redirect('/account');
    //res.redirect('/account');
  });



// -----------------
// Handles popup routes for watson's emotions and sentiment
// -----------------
  var popupArr = [expanderController.expandURL, newsController.isFakeNews, watsonController.getEmotions, watsonController.getSentiment, biasController.getData];

  app.post('/api/popover', popupArr, function(req, res, next) {
    res.json(res.compoundContent);
  });

};