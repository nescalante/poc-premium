'use strict';

var types = require('./serviceTypes.js');
var signal = types.filter(function (t) { return t.name === 'Signal'; })[0];
var pkg = types.filter(function (t) { return t.name === 'Package'; })[0];

var products = [{
  name: 'Signal Fox HD',
  type: signal,
}, {
  name: 'Signal Fox Life',
  type: signal,
}, {
  name: 'Signal Fox Sports',
  type: signal,
}, {
  name: 'Signal Fox Sports 2',
  type: signal,
}, {
  name: 'Signal Fox Sports 2 HD',
  type: signal,
}, {
  name: 'Signal Fox Sports Premium',
  type: signal,
}, {
  name: 'Signal FX',
  type: signal,
}, {
  name: 'Signal FX HD',
  type: signal,
}, {
  name: 'Signal Mundo Fox',
  type: signal,
}, {
  name: 'CF+NG',
  type: pkg,
}, {
  name: 'CF+NG+FS',
  type: pkg,
}, {
  name: 'CF+NG+FX+FS3+FL',
  type: pkg,
}, {
  name: 'FS3+NGW',
  type: pkg,
}, {
  name: 'FL+NGW+FS3',
  type: pkg,
}, {
  name: 'Syfy+UC',
  type: pkg,
}, {
  name: 'FSB+FS2',
  type: pkg,
}, {
  name: 'CF+NG+FS3',
  type: pkg,
}, {
  name: 'UTILIS+CF+NG+FX+FL',
  type: pkg,
}];

module.exports = products;
