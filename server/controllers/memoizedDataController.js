var memoizedData = require('../models/memoizedDataModel.js');

var Popover = memoizedData.memoizePopoverData;
var API = memoizedData.memoizePopoverData;

module.exports.recordPopoverData = function(req, res, next) {
  if (req.body.url) {
    if (res.hasOwnProperty('compoundContent')) {
      url = req.body.url
      Popover.find({})

    })
  }
}