'use strict';

var ko = require('knockout');

module.exports = ConditionRange;

function ConditionRange(parent) {
  var self = this;

  self.from = ko.observable();
  self.to = ko.observable();
  self.price = ko.observable();

  self.remove = function () {
    var isLast = self == parent.ranges()[parent.ranges().length - 1];
    if (parent.ranges().length > 1 && !isLast) {
      var result = parent.ranges()
        .filter(function (r) { return r != self; });
      parent.ranges(result);
    }
  };

  self.from.subscribe(function (from) {
    var prev = previousRange();

    if (prev && prev.to() !== from) {
      prev.to(from);
    }
  });

  self.to.subscribe(function (to) {
    var next = nextRange();

    if (next && next.from() !== to) {
      next.from(to);
    }
  });

  function previousRange() {
    var ranges = parent.ranges();
    var ix = ranges.indexOf(self);

    return ranges[ix - 1];
  }

  function nextRange() {
    var ranges = parent.ranges();
    var ix = ranges.indexOf(self);

    return ranges[ix + 1];
  }
}
