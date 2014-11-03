'use strict';

var billingMethods = require('../config').billingMethods;
var priceMethods = require('../config').priceMethods;
var ConditionRange = require('./range.js');

module.exports = Condition;

function Condition(billingMethod, parent) {
  var self = this;
  var subscriptions = [];

  self.billingMethod = billingMethod;
  self.invoiceGroup = ko.observable();
  self.priceMethod = ko.observable();
  self.serviceType = ko.observable();
  self.subscribersPackage = ko.observable();
  self.product = ko.observable();
  self.price = ko.numericObservable();
  self.ranges = ko.observableArray();
  self.defaultSubscribers = ko.numericObservable();
  self.sharePercentage = ko.numericObservable();

  self.currentRange = ko.computed(function () {
    return getRangeFor(parent.testSubscribers());
  });

  self.addToMonth = function () {
    parent.conditions.push(self);

    return false;
  };

  self.sort = function () {
    var result = self.ranges()
      .sort(function (a, b) {
        return a.to() > b.to() || !b.to();
      });

    self.ranges(result);
  };

  self.remove = function () {
    var result = parent.conditions()
      .filter(function (c) { return c !== self; });

    parent.conditions(result);
  };

  self.test = function(subscribers, retailPrice) {
    var range = getRangeFor(subscribers);
    var remaining = subscribers;
    var total = 0;
    var last;

    if (billingMethod === billingMethods.flatFee) {
      total = self.price();
    }
    else if (billingMethod === billingMethods.revenueShare && range) {
      total = retailPrice * (range.percentage() / 100) * subscribers;
    }
    else if (billingMethod === billingMethods.actualSubscribers && range) {
      if (self.priceMethod() === priceMethods.range) {
        total = range.price() * subscribers;
      }
      else if (self.priceMethod() == priceMethods.incremental) {
        self.ranges().forEach(function (r) {
          if (remaining) {
            if (r.to()) {
              remaining -= r.to() - ((last && last.to()) || 0);

              if (remaining > 0) {
                total += r.to() * r.price();
              }
              else {
                total += (r.to() + remaining) * r.price();
                remaining = 0;
              }
            }
            else {
              total += remaining * r.price();
              remaining = 0;
            }
          }

          last = r;
        });
      }
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
    ].map(function (f) {
      return lastRange[f].subscribe(addNewRange);
    }).forEach(function (s) {
      subscriptions.push(s);
    });
  }

  function getRangeFor(subscribers) {
    var range;

    self.ranges().forEach(function (r) {
      var isInfinity = r.price() && !r.to();
      var isOnRange = r.to() >= subscribers;

      if (isInfinity || (isOnRange && r.isHigherThan(range))) {
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
