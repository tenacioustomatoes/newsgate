var biasData = require('./biasrating.json');

module.exports = {
  getData: function (req, res, next) {
    res.send(JSON.stringify(biasData));
  }
};
