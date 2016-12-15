var biasData = require('./biasrating.json');
var url = require('url');

var sendJSONresponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports = {
  getData: function (req, res, next) {

    var rating = {
      '0': 'Far Left',
      '1': 'Left',
      '2': 'Center',
      '3': 'Right',
      '4': 'Far Right'
    };


    if (req.body.url) {
      var domain = req.body.url.replace(/^https?:\/\//, ''); // replace http and https
      domain = domain.replace(/www.?/, ''); //replace www. or www

      domain = domain.split('/')[0]; //Get the domain and only the domain

      if (domain) {
        var biasResult = (biasData[0][domain] === undefined) ? null : rating[biasData[0][domain]];

        var response = {
          'url': domain,
          'status': 'OK',
          'bias': biasResult
        };

        res.compoundContent['bias'] = response; // how does this work?
        next();

      } else {
        sendJSONresponse(res, 404, {
          'message': domain + ' is a malformed url'
        });
      }

    } else {
      sendJSONresponse(res, 404, {
        'message': 'no url in request'
      });
    }
  }
};
