var SavedLink = require('../models/linkModel.js');

module.exports.getTitle = function(req, res, next) {
	console.log('request body', req.body.url);
	var parameters = {
		url: req.body.url
	}
	alchemy_language.title(parameters, function (err, response) {
	  if (err)
	    console.log('error:', err);
	  else
	    console.log(JSON.stringify(response, null, 2));
			res.compoundContent = res.compoundContent || {};
			res.compoundContent['title'] = response;
			next();
	})
};

module.exports.getKeywords = function(req, res, next) {
	var parameters = {
		url: req.body.url
	}

	alchemy_language.keywords(parameters, function (err, response) {
	  if (err)
	    console.log('error:', err);
	  else
	  	res.compoundContent['keywords'] = response;
		next();
	    console.log(JSON.stringify(response, null, 2));
	})
}

var __filterKeywords = function(keywords) {
	var outputKeywords = [];
	outputKeywords = keywords.slice(0,5);
	outputKeywords = outputKeywords.map(keyword => {
		var newkeyword = {};
		newkeyword.relevance = keyword.relevance;
		newkeyword.text = keyword.text.toLowerCase();
		var solutations = /\b(m[rs]s*)\b\.*/gi;
		newkeyword.text = newkeyword.text.replace(solutations, ''); //get rid of mr. and mrs. 
		newkeyword.text = newkeyword.text.trim()
		console.log(keyword, 'in map keyword')
		console.log(newkeyword, 'in map newkeyword')
		
		return newkeyword;
	})
	//outputKeywords = keywords.filter(keyword => keyword.relevance > 0.75)
	return outputKeywords;
}

module.exports.saveToDB = function(req, res, next) {
	console.log('in save to DB');

	console.log('res body ->>>>>>>>', res.compoundContent)
	var filtered = __filterKeywords(res.compoundContent['keywords'].keywords);
	console.log('filtered ********', filtered);
	var linkData = {
		url: req.body.url, 
		title: res.compoundContent.title.title, 
		keywords: filtered
	}
	console.log('linkDATA!!!!', linkData);
	var newLinkSave = new SavedLink(linkData);
  newLinkSave.save().then(err => {
  	next();
  });
}
