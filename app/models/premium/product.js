'use strict';

var config = require('../config');
var billingMethods = require('../config').billingMethods;
var priceMethods = require('../config').priceMethods;
var Condition = require('./condition.js');

module.exports = Product;

function Product(parent) {
  var self = this;
  var subscriptions = [];
  var isSorting;

  self.invoiceGroup = ko.observable();
  self.product = ko.observable();
  self.subscribersPackage = ko.observable();
  self.category = ko.observable();
  self.price = ko.numericObservable();
  self.defaultSubscribers = ko.numericObservable();
  self.conditions = ko.observableArray();
  self.summaryCondition = ko.observable('lower');

  self.calculate = function (subscribers, retailPrice) {
    var total, selected;
    var condition = self.summaryCondition();
    var results = self.conditions().map(function (c) {
      return c.calculate(subscribers, retailPrice);
    });
    var totals = results.map(function (r) { return r.total; });

    if (condition === 'lower') {
      total = totals.sort(function (a, b) { return a - b; })[0];
    }
    else if (condition === 'higher') {
      total = totals.sort(function (a, b) { return a - b; })[totals.length - 1];
    }
    else if (condition === 'average') {
      total = totals.reduce(function (a, b) { return a + b; }, 0) / totals.length;
    }
    else if (condition === 'sum') {
      total = totals.reduce(function (a, b) { return a + b; }, 0);
    }

    var selected = condition !== 'average' && results.length > 1 ? results.filter(function (r) { return r.total === total })[0] : null;

    return {
      total: total || 0,
      conditions: results,
      selected: selected && selected.condition,
    };
  };

  self.$last = ko.computed(function () {
    return parent.products()[parent.products().length - 1] === self;
  });

  self.remove = function () {
    if (confirm('Are you sure you want to remove this product')) {
      var result = parent.products()
        .filter(function (p) { return p !== self; });

      parent.products(result);
    }
  };

  self.addCondition = function(obj) {
    var condition, billingMethod;

    // obj could be a billing method or a condition
    if (config.get(config.billingMethods).indexOf(obj) > -1) {
      condition = new Condition(obj, self);
    }
    else {
      billingMethod = config.getByName(config.billingMethods, obj.billingMethod);
      condition = new Condition(billingMethod, self, (obj.ranges && obj.ranges.length));

      condition.price(obj.price);
      condition.priceMethod(config.getByName(config.priceMethods, obj.priceMethod));

      (obj.ranges || []).forEach(condition.addRange);
    }

    self.conditions.push(condition);
  };
}
