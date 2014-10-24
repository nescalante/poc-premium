var ko = require('knockout');
var Month = require('./month.js');

module.exports = ContractPremium;

function ContractPremium() {
  var self = this;

  self.months = ko.observableArray();

  // testing data
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (i) {
    return new Month(i);
  }).forEach(addMonth);

  self.take = function (count) {
    return function(property) {
      return ko.computed(take.bind(self, property, count));
    };
  };

  function addMonth(month) {
    self.months.push(month);
  }
}

function take(property, count) {
  var current = 0;
  var result = [];

  property().forEach(function (i, ix) {
    var last = result.length - 1;
    current++;

    if (!result[last]) {
      result.push([]);
      last++;
    }

    if (result[last].length === count) {
      result.push([]);
      last++;
    }

    result[last].push(i);
  });

  return result;
}
