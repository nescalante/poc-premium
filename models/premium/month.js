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

  self.newCondition = function() {
    parent.selectedCondition(new Condition(self));
  };

  self.addCondition = function(condition) {
    var obj = new Condition(self);

    obj.billingMethod(condition.billingMethod);
    obj.serviceType(condition.signal);
    obj.subscribersPackage(condition.package);
    obj.price(condition.price);

    (condition.ranges || []).forEach(function (i) {
      var range = new ConditionRange(obj);

      range.from(i.from);
      range.to(i.to);
      range.price(i.price);
      range.percentage(i.percentage);

      obj.ranges.push(range);
    });

    self.conditions.push(obj)
  };

  self.template = function(condition) {
    return condition.billingMethod().template;
  };
}
