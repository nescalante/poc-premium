'use strict';

var ko = require('knockout');
var Condition = require('./condition.js');
var ConditionRange = require('./range.js');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = Month;

function Month(number, parent) {
  var self = this;

  self.name = months[number - 1];
  self.number = number > 9 ? '' + number : '0' + number;
  self.conditions = ko.observableArray();
  self.summaryCondition = ko.observable('lower');

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

      range.from(i.from);
      range.to(i.to);
      range.price(i.price);

      obj.ranges.push(range);
    });

    self.conditions.push(obj)
  };
}
