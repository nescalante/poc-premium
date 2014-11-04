'use strict';

var Condition = require('./condition.js');
var ConditionRange = require('./range.js');
var config = require('../config');
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

module.exports = Month;

function Month(number, parent) {
  var self = this;
  var testSubscribers = 0;
  var testRetailPrice = 0;
  var get = config.getByName;

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
    var billingMethod = get(config.billingMethods, condition.billingMethod);
    var obj = new Condition(billingMethod, self, (condition.ranges && condition.ranges.length));

    obj.serviceType(get(config.serviceTypes, condition.serviceType));
    obj.subscribersPackage(get(config.subscribersPackages, condition.subscribersPackage));
    obj.price(condition.price);
    obj.priceMethod(get(config.priceMethods, condition.priceMethod));
    obj.invoiceGroup(get(config.invoiceGroups, condition.invoiceGroup));
    obj.product(get(config.products, condition.product));
    obj.defaultSubscribers(condition.defaultSubscribers);

    (condition.ranges || []).forEach(obj.addRange);

    self.conditions.push(obj);
  };

  self.copyFrom = function (month) {
    var data = month.getMonthData();

    self.initialize(data);
  }

  self.getMonthData = function () {
    return {
      conditions: self.conditions().map(function (c) {
        return {
          billingMethod: c.billingMethod.name,
          invoiceGroup: c.invoiceGroup() && c.invoiceGroup().name,
          priceMethod: c.priceMethod() && c.priceMethod().name,
          serviceType: c.serviceType() && c.serviceType().name,
          subscribersPackage: c.subscribersPackage() && c.subscribersPackage().name,
          product: c.product() && c.product().name,
          price: c.price(),
          defaultSubscribers: c.defaultSubscribers(),
          ranges: c.ranges().map(function (r) {
            return {
              to: r.to(),
              price: r.price(),
              percentage: r.percentage(),
            };
          })
        };
      }),
      number: parseInt(self.number, 10),
      name: self.name,
      summaryCondition: self.summaryCondition(),
      testSubscribers: self.testSubscribers(),
      testRetailPrice: self.testRetailPrice(),
    };
  };

  self.initialize = function (data) {
    self.summaryCondition(data.summaryCondition);
    self.testSubscribers(data.testSubscribers);
    self.testRetailPrice(data.testRetailPrice);
    self.conditions([]);

    (data.conditions || []).forEach(self.addCondition);
  };
}
