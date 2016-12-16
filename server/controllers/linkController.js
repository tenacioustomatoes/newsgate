var SavedLink = require('../models/linkModel.js');

var __filterKeywords = function(keywords) {
  var outputKeywords = [];
  outputKeywords = keywords.slice(0, 5);
  outputKeywords = outputKeywords.map(keyword => {
    var newkeyword = {};
    newkeyword.relevance = keyword.relevance;
    newkeyword.text = keyword.text.toLowerCase();
    var solutations = /\b(m[rs]s*)\b\.*/gi;
    newkeyword.text = newkeyword.text.replace(solutations, ''); //get rid of mr. and mrs.
    newkeyword.text = newkeyword.text.trim();

    return newkeyword;
  });
  //outputKeywords = keywords.filter(keyword => keyword.relevance > 0.75)
  return outputKeywords;
};

module.exports.saveToDB = function(req, res, next) {

  var filtered = __filterKeywords(res.compoundContent['keywords'].keywords);
  var linkData = {
    url: req.body.url,
    title: res.compoundContent.title.title,
    keywords: filtered
  };

  var newLinkSave = new SavedLink(linkData);
  newLinkSave.save().then(err => {
    res.compoundContent['link'] = linkData;
    next();
  });

  var getAllLinks = function() {
    Link.find({}, function() {
      // todo!!
    });
  };
};
