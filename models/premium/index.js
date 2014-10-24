var ko = require('knockout');

module.exports = ContractPremium;

function ContractPremium() {
  var self = this;

  self.months = ko.observableArray();

  // testing data
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(function (i, ix) {
    var item = {};

    item.a = "somuchcodeforourmind"[ix];
    item.b = ix;

    self.months.push(item);
  });

  self.take = function (count) {
    return function(property) {
      return ko.computed(take.bind(self, property, count));
    };
  };
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
