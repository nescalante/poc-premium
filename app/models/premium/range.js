'use strict';

module.exports = ConditionRange;

function ConditionRange(parent) {
  var self = this;

  self.to = ko.numericObservable();
  self.price = ko.numericObservable();
  self.percentage = ko.numericObservable();

  self.remove = function () {
    var isLast = self === parent.ranges()[parent.ranges().length - 1];
    var isAnotherInfinity = parent.ranges().filter(function (r) { return r !== self && !r.to(); }).length;

    if ((parent.ranges().length > 1 && !isLast) || isAnotherInfinity) {
      var result = parent.ranges()
        .filter(function (r) { return r !== self; });
      parent.ranges(result);
    }
  };

  self.$last = ko.computed(function () {
    return parent.ranges()[parent.ranges().length - 1] === self;
  });

  [self.to, self.price, self.percentage].forEach(function (f) {
    f.subscribe(function (v) {
      if (!self.to() && !self.price() && !self.percentage()) {
        self.remove();
      }
      if (!self.to() && !self.$last() && parent.ranges().length) {
        parent.ranges()[parent.ranges().length - 1].remove();
      }
    });
  });

  self.isHigherThan = function (r) {
    return !r || (self.to() < r.to());
  };
}
