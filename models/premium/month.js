'use strict';

var Condition = require('./condition.js');
var ConditionRange = require('./range.js');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = Month;

function Month(number, parent) {
  var self = this;
  var testSubscribers = 0;
  var testRetailPrice = 0;

  self.name = months[number - 1];
  self.number = number > 9 ? '' + number : '0' + number;
  self.conditions = ko.observableArray();
  self.summaryCondition = ko.observable('lower');
  self.testSubscribers = ko.numericObservable();
  self.testRetailPrice = ko.numericObservable();

  self.testSubscribers.subscribe(function (value) {
    var ix = parent.months().indexOf(self);

    for (;ix < parent.months().length; ix++) {
      if (!parent.months()[ix].testSubscribers() || parent.months()[ix].testSubscribers() === testSubscribers) {
        parent.months()[ix].testSubscribers(value);
      }
    }

    testSubscribers = value;
  });

  self.testRetailPrice.subscribe(function (value) {
    var ix = parent.months().indexOf(self);

    for (;ix < parent.months().length; ix++) {
      if (!parent.months()[ix].testRetailPrice() || parent.months()[ix].testRetailPrice() === testRetailPrice) {
        parent.months()[ix].testRetailPrice(value);
      }
    }

    testRetailPrice = value;
  });

  self.testResult = ko.computed(function () {
    var condition = self.summaryCondition();
    var results = self.conditions().map(function (c) {
      return c.test(self.testSubscribers(), self.testRetailPrice());
    });
    var totals = results.map(function (r) { return r.total; });

    if (condition === 'lower') {
      return totals.sort(function (a, b) { return a - b; })[0];
    }
    else if (condition === 'higher') {
      return totals.sort(function (a, b) { return a - b; })[totals.length - 1];
    }
    else if (condition === 'average') {
      return totals.reduce(function (a, b) { return a + b; }, 0) / totals.length;
    }
  });

  self.$last = ko.computed(function () {
    return parent.months()[parent.months().length - 1] === self;
  });

  self.newCondition = function(serviceType) {
    var condition = new Condition(serviceType, self);

    self.conditions.push(condition);
  };

  self.addCondition = function(condition) {
    var obj = new Condition(condition.billingMethod, self, (condition.ranges && condition.ranges.length));

    obj.serviceType(condition.serviceType);
    obj.subscribersPackage(condition.subscribersPackage);
    obj.price(condition.price);
    obj.priceMethod(condition.priceMethod);
    obj.invoiceGroup(condition.invoiceGroup);
    obj.product(condition.product);
    obj.defaultSubscribers(condition.defaultSubscribers);

    (condition.ranges || []).forEach(obj.addRange);

    self.conditions.push(obj);
  };
}
