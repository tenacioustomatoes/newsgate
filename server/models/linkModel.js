var mongoose = require('mongoose');

var keywordSchema = new mongoose.Schema({
  relevance: String, 
  text: String
});

var savedLinkSchema = new mongoose.Schema({
  url: String,
  title: String,
  keywords: [keywordSchema]
});

module.exports = mongoose.model('SavedLink', savedLinkSchema);
