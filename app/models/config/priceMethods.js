'use strict';

var range = createMethod('Range');
var incremental = createMethod('Incremental');

module.exports = {
  range: range,
  incremental: incremental,
};

function createMethod(name) {
  return {
    name: name,
  };
}
