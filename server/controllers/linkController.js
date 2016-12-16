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

module.exports = {

  saveToDB: function(req, res, next) {
    var filtered = __filterKeywords(res.compoundContent['keywords'].keywords);
    var linkData = {
      name: req.user.displayName,
      fbID: req.user.id,
      url: req.body.url,
      title: res.compoundContent.title.title,
      keywords: filtered
    };
    console.log('linkDATA!!!!', linkData);
    var newLinkSave = new SavedLink(linkData);
    newLinkSave.save()
    .exec(function(err, data) {
      if (err) {
        console.log(err);
      }
      res.compoundContent['link'] = linkData;
      next();
    });
  },

  getLinks: function(req, res, next) {
    if (req.user.id) {
      Link.find({fbID: req.user.id})
      .exex(function(err, data) {
        if (err) {
          console.log(err);
        }
        if (data) {
          console.log('found link data', data);
        }
      });
    } else {
      //No user id found
      res.sendStatus(403);
    }
  }
};
