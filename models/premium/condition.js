'use strict';

var ko = require('knockout');
var ConditionRange = require('./range.js');

module.exports = Condition;

function Condition(parent) {
  var self = this;
  var subscriptions = [];

  self.billingMethod = ko.observable();
  self.invoiceGroup = ko.observable();
  self.priceMethod = ko.observable();
  self.serviceType = ko.observable();
  self.subscribersPackage = ko.observable();
  self.product = ko.observable();
  self.price = ko.observable();
  self.ranges = ko.observableArray();
  self.defaultSubscribers = ko.observable();

  self.template = ko.computed(function() {
    return self.billingMethod() && self.billingMethod().template;
  });

  self.addToMonth = function () {
    parent.conditions.push(self);

    return false;
  };

  initializeNewRange();

  function initializeNewRange() {
    var lastRange;

    self.ranges.push(new ConditionRange(self));
    lastRange = self.ranges()[self.ranges().length - 1];
    [
      'to',
      'price',
      'percentage',
    ].map(function (f) {
      return lastRange[f].subscribe(addNewRange);
    }).forEach(function (s) {
      subscriptions.push(s);
    });
  }

  function addNewRange(value) {
    if (value) {
      subscriptions.forEach(function (s) {
        s.dispose();
      });
      subscriptions = [];
      initializeNewRange();
    }
  }
}
