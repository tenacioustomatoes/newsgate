var mongoose = require ('mongoose');

var popoverSchema = new mongoose.Schema({
  url: { type: String, unique: true},
  response: String
});

var totalApiSchema = new mongoose.Schema({
  url: { type: String, unique: true},
  response: String
});

module.exports.memoizePopoverData = mongoose.model('MemoizedPopoverData', popoverSchema);

module.exports.memoizeTotalApi = mongoose.model('MemoizedPopoverData', popoverSchema);