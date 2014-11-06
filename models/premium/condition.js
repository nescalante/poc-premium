'use strict';

var billingMethods = require('../config').billingMethods;
var priceMethods = require('../config').priceMethods;
var ConditionRange = require('./range.js');

module.exports = Condition;

function Condition(billingMethod, parent, preventRangeInit) {
  var self = this;
  var subscriptions = [];
  var isSorting;

  self.billingMethod = billingMethod;
  self.invoiceGroup = ko.observable();
  self.priceMethod = ko.observable();
  self.serviceType = ko.observable();
  self.subscribersPackage = ko.observable();
  self.product = ko.observable();
  self.category = ko.observable();
  self.price = ko.numericObservable();
  self.ranges = ko.observableArray();
  self.defaultSubscribers = ko.numericObservable();
  self.currentRange = ko.observable();

  self.ranges.subscribe(function () {
    var lastRange = self.ranges()[self.ranges().length - 1];
    disposeSubscriptions();
    subscribeRange(lastRange);
    if (!isSorting) {
      isSorting = true;
      self.sort();
    }
  });

  self.sort = function () {
    var result = self.ranges()
      .sort(function (a, b) {
        if (!b.to()) {
          return -1;
        }
        else if (!a.to()) {
          return 1;
        }
        else {
          return a.to() - b.to();
        }
      });

    self.ranges(result);
    isSorting = false;
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

    // just for visual help
    self.currentRange(range);

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
      else if (self.priceMethod() === priceMethods.incremental) {

        self.ranges().forEach(function (r) {
          var lastTo = last ? last.to() : 0;

          if (remaining && r.price()) {
            if (r.to()) {
              remaining -= r.to() - lastTo;

              if (remaining > 0) {
                total += (r.to() - lastTo) * r.price();
              }
              else {
                total += (r.to() - lastTo + remaining) * r.price();
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

  self.addRange = function (i) {
    var range = new ConditionRange(self);

    range.to(i.to);
    range.price(i.price);
    range.percentage(i.percentage);

    self.ranges.push(range);
  };

  !preventRangeInit && initializeNewRange();

  function initializeNewRange() {
    self.ranges.push(new ConditionRange(self));
  }

  function subscribeRange(range) {
    [
      'to',
    ].map(function (f) {
      return range[f].subscribe(addNewRange);
    }).forEach(function (s) {
      subscriptions.push(s);
    });
  }

  function getRangeFor(subscribers) {
    var range;

    self.ranges().forEach(function (r) {
      var isOnRange = r.to() >= subscribers;

      if (isOnRange && r.isHigherThan(range)) {
        range = r;
      }
    });

    if (!range) {
      range = self.ranges().filter(function (r) {
        return (r.price() || r.percentage()) && !r.to();
      })[0];
    }

    return range;
  }

  function addNewRange(value) {
    if (value) {
      disposeSubscriptions();
      initializeNewRange();
    }
  }

  function disposeSubscriptions() {
    subscriptions.forEach(function (s) {
        s.dispose();
      });
    subscriptions = [];
  }
}
