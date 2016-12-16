var SavedLink = require('../models/linkModel.js');

module.exports.getTitle = function(req, res, next) {
  var parameters = {
    url: req.body.url
  };
  alchemy_language.title(parameters, function (err, response) {
    if (err) {
      console.log('error:', err);
    } else {
      res.compoundContent = res.compoundContent || {};
      res.compoundContent['title'] = response;
      next();
    }
  });
};

module.exports.getKeywords = function(req, res, next) {
  var parameters = {
    url: req.body.url
  };

  alchemy_language.keywords(parameters, function (err, response) {
    if (err) {
      console.log('error:', err);
    } else {
      res.compoundContent['keywords'] = response;
      next();
    }
  });
};

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
  });
};
