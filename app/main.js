'use strict';

global.ko = require('knockout');
global.models = require('./models');
global.use = use;

// extensions
ko.numericObservable = require('./extensions/numericObservable.js');

function use(Model) {
  var model = new Model();

  ko.applyBindings(model);
}
