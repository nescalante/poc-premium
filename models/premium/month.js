'use strict';

var Condition = require('./condition.js');
var ConditionRange = require('./range.js');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = Month;

function Month(number, parent) {
  var self = this;
  var testSubscribers = 0;

  self.name = months[number - 1];
  self.number = number > 9 ? '' + number : '0' + number;
  self.conditions = ko.observableArray();
  self.summaryCondition = ko.observable('lower');
  self.testSubscribers = ko.numericObservable();

  self.testResult = ko.computed(function () {
    var condition = self.summaryCondition();
    var results = self.conditions().map(function (c) {
      return c.test(self.testSubscribers());
    });

    if (condition === 'lower') {
      return results.sort()[0];
    }
    else if (condition === 'higher') {
      return results.sort()[results.length - 1];
    }
    else if (condition === 'average') {
      return results.reduce(function (a, b) { return a + b; }, 0) / results.length;
    }
  });

  self.$last = ko.computed(function () {
    return parent.months()[parent.months().length - 1] === self;
  });

  self.newCondition = function(serviceType) {
    var condition = new Condition(self);

    condition.billingMethod(serviceType);
    self.conditions.push(condition);
  };

  self.addCondition = function(condition) {
    var obj = new Condition(self);

    obj.billingMethod(condition.billingMethod);
    obj.serviceType(condition.serviceType);
    obj.subscribersPackage(condition.subscribersPackage);
    obj.price(condition.price);

    (condition.ranges || []).forEach(function (i) {
      var range = new ConditionRange(obj);

      range.to(i.to);
      range.price(i.price);

      obj.ranges.push(range);
    });

    self.conditions.push(obj);
  };
}
