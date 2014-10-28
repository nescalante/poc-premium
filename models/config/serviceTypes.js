'use strict';

var products = require('./products.js');
var types = [{
  name: 'Signal',
}, {
  name: 'Package',
}];

module.exports = types.map(function (t) {
  t.products = products.filter(function (p) { return p.type == t.name });

  return t;
});
