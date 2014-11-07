global.ko = require('knockout');
global.models = require('./models');

// extensions
ko.numericObservable = require('./extensions/numericObservable.js');

global.use = use;

function use(Model) {
  var model = new Model();

  ko.applyBindings(model);
}
