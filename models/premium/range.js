'use strict';

module.exports = ConditionRange;

function ConditionRange(parent) {
  var self = this;

  self.to = ko.numericObservable();
  self.price = ko.numericObservable();

  self.remove = function () {
    var isLast = self === parent.ranges()[parent.ranges().length - 1];
    if (parent.ranges().length > 1 && !isLast) {
      var result = parent.ranges()
        .filter(function (r) { return r !== self; });
      parent.ranges(result);
    }
  };

  self.isHigherThan = function (r) {
    return !r || (self.to() < r.to());
  };
}
