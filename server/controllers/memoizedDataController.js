var url = require('url');
const memoizedData = require('../controllers/memoizedDataController.js');

var Popover = memoizedData.popover;
var API = memoizedData.api;

module.exports.recordPopoverData = function(req, res, next) {
  console.log('\n\n model \n\n', model);
  if (req.body.url) {
    if (res.hasOwnProperty('compoundContent')) {
      var parsedUrl = url.parse(req.body.url);
      var lookupUrl = parsedUrl.host + parsedUrl.pathname;

      Popover
      .findOne({url: lookupUrl})
      .exec(function(err, data) {
        if (err) {
          console.log(err);
        }
        if (!data) {
          var newEntry = new Popover({url: lookupUrl, response: res.compoundContent});

          newEntry.save(function(err) {
            if (err) {
              console.log(err);
            }
          });
        }
      });
    }
  }
  next();
};

module.exports.readPopoverData = function(req, res, next) {
  if (req.body.url) {
    var parsedUrl = url.parse(req.body.url);
    var lookupUrl = parsedUrl.host + parsedUrl.pathname;

    Popover
    .findOne({url: lookupUrl})
    .exec(function(err, data) {
      if (err) {
        console.log(err);
      }
      if (data) {
        //found result in database
        res.json(data.response);
      } else {
        //did not find result
        next();
      }
    });

  } else {
    next();
  }
};