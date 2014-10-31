'use strict';

var billingMethods = require('../config').billingMethods;
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
  self.price = ko.numericObservable();
  self.ranges = ko.observableArray();
  self.defaultSubscribers = ko.numericObservable();
  self.sharePercentage = ko.numericObservable();

  self.template = ko.computed(function() {
    return self.billingMethod() && self.billingMethod().template;
  });

  self.currentRange = ko.computed(function () {
    return getRangeFor(parent.testSubscribers());
  });

  self.addToMonth = function () {
    parent.conditions.push(self);

    return false;
  };

  self.remove = function () {
    var result = parent.conditions()
      .filter(function (c) { return c !== self; });

    parent.conditions(result);
  };

  self.test = function(subscribers) {
    var billingMethod = self.billingMethod();
    var range = getRangeFor(subscribers);
    var total;

    if (billingMethod === billingMethods.flatFee) {
      total = self.price();
    }
    else if (billingMethod === billingMethods.revenueShare && range) {
      total = range.price() * self.sharePercentage() * subscribers;
    }
    else if (billingMethod === billingMethods.actualSubscribers && range) {
      total = range.price() * subscribers;
    }

    return {
      total: total,
      range: range,
    };
  };

  initializeNewRange();

  function initializeNewRange() {
    var lastRange;

    self.ranges.push(new ConditionRange(self));
    lastRange = self.ranges()[self.ranges().length - 1];
    [
      'to',
      'price',
    ].map(function (f) {
      return lastRange[f].subscribe(addNewRange);
    }).forEach(function (s) {
      subscriptions.push(s);
    });
  }

  function getRangeFor(subscribers) {
    var range;

    self.ranges().forEach(function (r) {
      if (r.to() >= subscribers && r.isHigherThan(range)) {
        range = r;
      }
    });

    return range;
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
